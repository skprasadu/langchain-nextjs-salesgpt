import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { config } from "dotenv";
config();

export const llm = new ChatOpenAI({
    streaming: true,
    //verbose: true,
    temperature: 0,
  });

export const embeddings = new OpenAIEmbeddings({
});
  
