import { LLMChain } from "langchain/chains";
import { BaseLanguageModel } from "langchain/base_language";
export declare function loadStageAnalyzerChain(llm: BaseLanguageModel, verbose?: boolean): LLMChain<string, BaseLanguageModel<any, import("langchain/base_language").BaseLanguageModelCallOptions>>;
export declare function loadSalesConversationChain(llm: BaseLanguageModel, verbose?: boolean): LLMChain<string, BaseLanguageModel<any, import("langchain/base_language").BaseLanguageModelCallOptions>>;
export declare const stage_analyzer_chain: LLMChain<string, BaseLanguageModel<any, import("langchain/base_language").BaseLanguageModelCallOptions>>;
export declare const sales_conversation_utterance_chain: LLMChain<string, BaseLanguageModel<any, import("langchain/base_language").BaseLanguageModelCallOptions>>;
