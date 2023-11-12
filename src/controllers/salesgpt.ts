import { LLMSingleActionAgent, AgentExecutor } from "langchain/agents";
import { BaseChain, LLMChain } from "langchain/chains";
import { ChainValues } from "langchain/schema";
import { CallbackManagerForChainRun } from "langchain/callbacks";
import { BaseLanguageModel } from "langchain/base_language";
import { loadSalesConversationChain, loadStageAnalyzerChain } from "./chains";
import { SALES_AGENT_TOOLS_PROMPT } from "../constants/sales-agent-tool-prompt";
import { SalesConvoOutputParser } from "./sales-convo-output-parser";
import { CustomPromptTemplateForTools } from "./custom-prompt-template-for-tools";
import { get_tools } from "../knowledge/data_ingest";
import { CONVERSATION_STAGES } from "../constants/conversation-stages";

export class SalesGPT extends BaseChain {
  conversation_stage_id: string;
  conversation_history: string[];
  current_conversation_stage: string = "1";
  stage_analyzer_chain: LLMChain; // StageAnalyzerChain
  sales_conversation_utterance_chain: LLMChain; // SalesConversationChain
  sales_agent_executor?: AgentExecutor;
  use_tools: boolean = false;

  conversation_stage_dict: Record<string, string> = CONVERSATION_STAGES;

  salesperson_name: string = "Ted Lasso";
  salesperson_role: string = "Business Development Representative";
  company_name: string = "Sleep Haven";
  company_business: string =
    "Sleep Haven is a premium mattress company that provides customers with the most comfortable and supportive sleeping experience possible. We offer a range of high-quality mattresses, pillows, and bedding accessories that are designed to meet the unique needs of our customers.";
  company_values: string =
    "Our mission at Sleep Haven is to help people achieve a better night's sleep by providing them with the best possible sleep solutions. We believe that quality sleep is essential to overall health and well-being, and we are committed to helping our customers achieve optimal sleep by offering exceptional products and customer service.";
  conversation_purpose: string =
    "find out whether they are looking to achieve better sleep via buying a premier mattress.";
  conversation_type: string = "call";

  constructor(args: {
    stage_analyzer_chain: LLMChain;
    sales_conversation_utterance_chain: LLMChain;
    sales_agent_executor?: AgentExecutor;
    use_tools: boolean;
  }) {
    super();
    this.stage_analyzer_chain = args.stage_analyzer_chain;
    this.sales_conversation_utterance_chain =
      args.sales_conversation_utterance_chain;
    this.sales_agent_executor = args.sales_agent_executor;
    this.use_tools = args.use_tools;
  }

  retrieve_conversation_stage(key = "0") {
    return this.conversation_stage_dict[key] || "1";
  }

  seed_agent() {
    // Step 1: seed the conversation
    this.current_conversation_stage = this.retrieve_conversation_stage("1");
    this.conversation_stage_id = "0";
    this.conversation_history = [];
  }

  async determine_conversation_stage() {
    let { text } = await this.stage_analyzer_chain.call({
      conversation_history: this.conversation_history.join("\n"),
      current_conversation_stage: this.current_conversation_stage,
      conversation_stage_id: this.conversation_stage_id,
    });

    this.conversation_stage_id = text;
    this.current_conversation_stage = this.retrieve_conversation_stage(text);
    console.log(`${text}: ${this.current_conversation_stage}`);
    return text;
  }
  human_step(human_input: string) {
    this.conversation_history.push(`User: ${human_input} <END_OF_TURN>`);
  }

  async step() {
    const res = await this._call({ inputs: {} });
    return res;
  }

  async _call(
    _values: ChainValues,
    runManager?: CallbackManagerForChainRun
  ): Promise<ChainValues> {
    // Run one step of the sales agent.
    // Generate agent's utterance
    let ai_message;
    let res;
    if (this.use_tools && this.sales_agent_executor) {
      res = await this.sales_agent_executor.call(
        {
          input: "",
          conversation_stage: this.current_conversation_stage,
          conversation_history: this.conversation_history.join("\n"),
          salesperson_name: this.salesperson_name,
          salesperson_role: this.salesperson_role,
          company_name: this.company_name,
          company_business: this.company_business,
          company_values: this.company_values,
          conversation_purpose: this.conversation_purpose,
          conversation_type: this.conversation_type,
        },
        runManager?.getChild("sales_agent_executor")
      );
      ai_message = res.output;
    } else {
      res = await this.sales_conversation_utterance_chain.call(
        {
          salesperson_name: this.salesperson_name,
          salesperson_role: this.salesperson_role,
          company_name: this.company_name,
          company_business: this.company_business,
          company_values: this.company_values,
          conversation_purpose: this.conversation_purpose,
          conversation_history: this.conversation_history.join("\n"),
          conversation_stage: this.current_conversation_stage,
          conversation_type: this.conversation_type,
        },
        runManager?.getChild("sales_conversation_utterance")
      );
      ai_message = res.text;
    }

    // Add agent's response to conversation history
    console.log(`${this.salesperson_name}: ${ai_message}`);
    const out_message = ai_message;
    const agent_name = this.salesperson_name;
    ai_message = agent_name + ": " + ai_message;
    if (!ai_message.includes("<END_OF_TURN>")) {
      ai_message += " <END_OF_TURN>";
    }
    this.conversation_history.push(ai_message);
    return out_message;
  }
  static async from_llm(
    llm: BaseLanguageModel,
    verbose: boolean,
    config: {
      use_tools: boolean;
      product_catalog: string;
      salesperson_name: string;
    }
  ) {
    const { use_tools, product_catalog, salesperson_name } = config;
    let sales_agent_executor;
    let tools;
    if (use_tools !== undefined && use_tools === false) {
      sales_agent_executor = undefined;
    } else {
      tools = await get_tools(product_catalog);

      const prompt = new CustomPromptTemplateForTools({
        tools,
        inputVariables: [
          "input",
          "intermediate_steps",
          "salesperson_name",
          "salesperson_role",
          "company_name",
          "company_business",
          "company_values",
          "conversation_purpose",
          "conversation_type",
          "conversation_history",
        ],
        template: SALES_AGENT_TOOLS_PROMPT,
      });
      const llm_chain = new LLMChain({
        llm,
        prompt,
        verbose,
      });
      const tool_names = tools.map((e) => e.name);
      const output_parser = new SalesConvoOutputParser({
        ai_prefix: salesperson_name,
      });
      const sales_agent_with_tools = new LLMSingleActionAgent({
        llmChain: llm_chain,
        outputParser: output_parser,
        stop: ["\nObservation:"],
      });
      sales_agent_executor = AgentExecutor.fromAgentAndTools({
        agent: sales_agent_with_tools,
        tools,
        verbose,
      });
    }

    const salesGPT = new SalesGPT({
      stage_analyzer_chain: loadStageAnalyzerChain(llm, verbose),
      sales_conversation_utterance_chain: loadSalesConversationChain(
        llm,
        verbose
      ),
      sales_agent_executor,
      use_tools,
    });
    salesGPT.salesperson_name = salesperson_name;

    return salesGPT;
  }

  _chainType(): string {
    throw new Error("Method not implemented.");
  }

  get inputKeys(): string[] {
    return [];
  }

  get outputKeys(): string[] {
    return [];
  }
}