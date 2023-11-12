import { env } from "./config";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore  } from "langchain/vectorstores/faiss";
//import { PineconeClient } from "@pinecone-database/pinecone";

export async function embedAndStoreDocs(
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    const embeddings = new OpenAIEmbeddings();

    //embed the PDF documents
    const db = await FaissStore.fromDocuments(docs, embeddings);
    db.save("faiss_index");

    /*console.log("************** saved")
    // Load the vector store from the same directory
    const loadedVectorStore = await FaissStore.load(
      "C:/my-applications/javascript/pdf-chat-ai-sdk/faiss_index",
      embeddings
    );
    console.log("************** loaded")

    // vectorStore and loadedVectorStore are identical
    const result = await loadedVectorStore.similaritySearch("hello world", 1);
    console.log(result);*/
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore() {
  try {
    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await FaissStore.load(
      "faiss_index",
      embeddings
    );

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
