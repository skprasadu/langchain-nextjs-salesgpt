import { RetrievalQAChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { ChainTool } from "langchain/tools";
import { BaseLanguageModel } from "langchain/base_language";
export declare function loadSalesDocVectorStore(FileName: string): Promise<FaissStore>;
export declare function setup_knowledge_base(FileName: string, llm: BaseLanguageModel): Promise<RetrievalQAChain>;
export declare function get_tools(product_catalog: string): Promise<ChainTool[]>;
