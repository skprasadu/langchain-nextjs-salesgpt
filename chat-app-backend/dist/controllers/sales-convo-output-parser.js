"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesConvoOutputParser = void 0;
const agents_1 = require("langchain/agents");
class SalesConvoOutputParser extends agents_1.AgentActionOutputParser {
    constructor(args) {
        super();
        this.lc_namespace = ["langchain", "agents", "custom_llm_agent"];
        this.ai_prefix = args?.ai_prefix || "AI";
        this.verbose = !!args?.verbose;
    }
    async parse(text) {
        if (this.verbose) {
            console.log("TEXT");
            console.log(text);
            console.log("-------");
        }
        const regexOut = /<END_OF_CALL>|<END_OF_TURN>/g;
        if (text.includes(this.ai_prefix + ":")) {
            const parts = text.split(this.ai_prefix + ":");
            const input = parts[parts.length - 1].trim().replace(regexOut, "");
            const finalAnswers = { output: input };
            return { log: text, returnValues: finalAnswers };
        }
        const regex = /Action: (.*?)[\n]*Action Input: (.*)/;
        const match = text.match(regex);
        if (!match) {
            return {
                log: text,
                returnValues: { output: text.replace(regexOut, "") },
            };
        }
        return {
            tool: match[1].trim(),
            toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
            log: text,
        };
    }
    getFormatInstructions(_options) {
        throw new Error("Method not implemented.");
    }
    _type() {
        return "sales-agent";
    }
}
exports.SalesConvoOutputParser = SalesConvoOutputParser;
//# sourceMappingURL=sales-convo-output-parser.js.map