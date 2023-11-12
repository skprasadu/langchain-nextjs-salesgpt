import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
export declare const llm: ChatOpenAI<import("langchain/chat_models/openai").ChatOpenAICallOptions>;
export declare const embeddings: OpenAIEmbeddings;
