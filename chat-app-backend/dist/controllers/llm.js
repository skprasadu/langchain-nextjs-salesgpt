"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddings = exports.llm = void 0;
const openai_1 = require("langchain/chat_models/openai");
const openai_2 = require("langchain/embeddings/openai");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.llm = new openai_1.ChatOpenAI({
    streaming: true,
    temperature: 0,
});
exports.embeddings = new openai_2.OpenAIEmbeddings({});
//# sourceMappingURL=llm.js.map