"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesGPT = void 0;
const agents_1 = require("langchain/agents");
const chains_1 = require("langchain/chains");
const chains_2 = require("./chains");
const sales_agent_tool_prompt_1 = require("../constants/sales-agent-tool-prompt");
const sales_convo_output_parser_1 = require("./sales-convo-output-parser");
const custom_prompt_template_for_tools_1 = require("./custom-prompt-template-for-tools");
const data_ingest_1 = require("../knowledge/data_ingest");
const conversation_stages_1 = require("../constants/conversation-stages");
class SalesGPT extends chains_1.BaseChain {
    constructor(args) {
        super();
        this.current_conversation_stage = "1";
        this.use_tools = false;
        this.conversation_stage_dict = conversation_stages_1.CONVERSATION_STAGES;
        this.salesperson_name = "Ted Lasso";
        this.salesperson_role = "Business Development Representative";
        this.company_name = "Sleep Haven";
        this.company_business = "Sleep Haven is a premium mattress company that provides customers with the most comfortable and supportive sleeping experience possible. We offer a range of high-quality mattresses, pillows, and bedding accessories that are designed to meet the unique needs of our customers.";
        this.company_values = "Our mission at Sleep Haven is to help people achieve a better night's sleep by providing them with the best possible sleep solutions. We believe that quality sleep is essential to overall health and well-being, and we are committed to helping our customers achieve optimal sleep by offering exceptional products and customer service.";
        this.conversation_purpose = "find out whether they are looking to achieve better sleep via buying a premier mattress.";
        this.conversation_type = "call";
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
    human_step(human_input) {
        this.conversation_history.push(`User: ${human_input} <END_OF_TURN>`);
    }
    async step() {
        const res = await this._call({ inputs: {} });
        return res;
    }
    async _call(_values, runManager) {
        let ai_message;
        let res;
        if (this.use_tools && this.sales_agent_executor) {
            res = await this.sales_agent_executor.call({
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
            }, runManager?.getChild("sales_agent_executor"));
            ai_message = res.output;
        }
        else {
            res = await this.sales_conversation_utterance_chain.call({
                salesperson_name: this.salesperson_name,
                salesperson_role: this.salesperson_role,
                company_name: this.company_name,
                company_business: this.company_business,
                company_values: this.company_values,
                conversation_purpose: this.conversation_purpose,
                conversation_history: this.conversation_history.join("\n"),
                conversation_stage: this.current_conversation_stage,
                conversation_type: this.conversation_type,
            }, runManager?.getChild("sales_conversation_utterance"));
            ai_message = res.text;
        }
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
    static async from_llm(llm, verbose, config) {
        const { use_tools, product_catalog, salesperson_name } = config;
        let sales_agent_executor;
        let tools;
        if (use_tools !== undefined && use_tools === false) {
            sales_agent_executor = undefined;
        }
        else {
            tools = await (0, data_ingest_1.get_tools)(product_catalog);
            const prompt = new custom_prompt_template_for_tools_1.CustomPromptTemplateForTools({
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
                template: sales_agent_tool_prompt_1.SALES_AGENT_TOOLS_PROMPT,
            });
            const llm_chain = new chains_1.LLMChain({
                llm,
                prompt,
                verbose,
            });
            const tool_names = tools.map((e) => e.name);
            const output_parser = new sales_convo_output_parser_1.SalesConvoOutputParser({
                ai_prefix: salesperson_name,
            });
            const sales_agent_with_tools = new agents_1.LLMSingleActionAgent({
                llmChain: llm_chain,
                outputParser: output_parser,
                stop: ["\nObservation:"],
            });
            sales_agent_executor = agents_1.AgentExecutor.fromAgentAndTools({
                agent: sales_agent_with_tools,
                tools,
                verbose,
            });
        }
        const salesGPT = new SalesGPT({
            stage_analyzer_chain: (0, chains_2.loadStageAnalyzerChain)(llm, verbose),
            sales_conversation_utterance_chain: (0, chains_2.loadSalesConversationChain)(llm, verbose),
            sales_agent_executor,
            use_tools,
        });
        salesGPT.salesperson_name = salesperson_name;
        return salesGPT;
    }
    _chainType() {
        throw new Error("Method not implemented.");
    }
    get inputKeys() {
        return [];
    }
    get outputKeys() {
        return [];
    }
}
exports.SalesGPT = SalesGPT;
//# sourceMappingURL=salesgpt.js.map