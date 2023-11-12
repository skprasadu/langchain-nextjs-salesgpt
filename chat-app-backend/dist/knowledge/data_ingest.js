"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_tools = exports.setup_knowledge_base = exports.loadSalesDocVectorStore = void 0;
const chains_1 = require("langchain/chains");
const faiss_1 = require("langchain/vectorstores/faiss");
const text_1 = require("langchain/document_loaders/fs/text");
const text_splitter_1 = require("langchain/text_splitter");
const tools_1 = require("langchain/tools");
const llm_1 = require("../controllers/llm");
const retrievalLlm = llm_1.llm;
async function loadSalesDocVectorStore(FileName) {
    const loader = new text_1.TextLoader(`./src/knowledge/${FileName}`);
    const docs = await loader.load();
    const splitter = new text_splitter_1.CharacterTextSplitter({
        chunkSize: 10,
        chunkOverlap: 0,
    });
    const new_docs = await splitter.splitDocuments(docs);
    return faiss_1.FaissStore.fromDocuments(new_docs, llm_1.embeddings);
}
exports.loadSalesDocVectorStore = loadSalesDocVectorStore;
async function setup_knowledge_base(FileName, llm) {
    const vectorStore = await loadSalesDocVectorStore(FileName);
    const knowledge_base = chains_1.RetrievalQAChain.fromLLM(retrievalLlm, vectorStore.asRetriever());
    return knowledge_base;
}
exports.setup_knowledge_base = setup_knowledge_base;
async function get_tools(product_catalog) {
    const chain = await setup_knowledge_base(product_catalog, retrievalLlm);
    const tools = [
        new tools_1.ChainTool({
            name: "ProductSearch",
            description: "useful for when you need to answer questions about product information",
            chain,
        }),
    ];
    return tools;
}
exports.get_tools = get_tools;
//# sourceMappingURL=data_ingest.js.map