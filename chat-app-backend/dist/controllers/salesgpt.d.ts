import { AgentExecutor } from "langchain/agents";
import { BaseChain, LLMChain } from "langchain/chains";
import { ChainValues } from "langchain/schema";
import { CallbackManagerForChainRun } from "langchain/callbacks";
import { BaseLanguageModel } from "langchain/base_language";
export declare class SalesGPT extends BaseChain {
    conversation_stage_id: string;
    conversation_history: string[];
    current_conversation_stage: string;
    stage_analyzer_chain: LLMChain;
    sales_conversation_utterance_chain: LLMChain;
    sales_agent_executor?: AgentExecutor;
    use_tools: boolean;
    conversation_stage_dict: Record<string, string>;
    salesperson_name: string;
    salesperson_role: string;
    company_name: string;
    company_business: string;
    company_values: string;
    conversation_purpose: string;
    conversation_type: string;
    constructor(args: {
        stage_analyzer_chain: LLMChain;
        sales_conversation_utterance_chain: LLMChain;
        sales_agent_executor?: AgentExecutor;
        use_tools: boolean;
    });
    retrieve_conversation_stage(key?: string): string;
    seed_agent(): void;
    determine_conversation_stage(): Promise<any>;
    human_step(human_input: string): void;
    step(): Promise<ChainValues>;
    _call(_values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    static from_llm(llm: BaseLanguageModel, verbose: boolean, config: {
        use_tools: boolean;
        product_catalog: string;
        salesperson_name: string;
    }): Promise<SalesGPT>;
    _chainType(): string;
    get inputKeys(): string[];
    get outputKeys(): string[];
}
