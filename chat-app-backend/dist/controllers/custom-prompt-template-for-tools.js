"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPromptTemplateForTools = void 0;
const prompts_1 = require("langchain/prompts");
class CustomPromptTemplateForTools extends prompts_1.BaseStringPromptTemplate {
    constructor(args) {
        super({ inputVariables: args.inputVariables });
        this.tools = args.tools;
        this.template = args.template;
    }
    format(input) {
        const intermediateSteps = input.intermediate_steps;
        const agentScratchpad = intermediateSteps.reduce((thoughts, { action, observation }) => thoughts +
            [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"), "");
        input["agent_scratchpad"] = agentScratchpad;
        const toolStrings = this.tools
            .map((tool) => `${tool.name}: ${tool.description}`)
            .join("\n");
        input["tools"] = toolStrings;
        const toolNames = this.tools.map((tool) => tool.name).join("\n");
        input["tool_names"] = toolNames;
        const newInput = { ...input };
        return Promise.resolve((0, prompts_1.renderTemplate)(this.template, "f-string", newInput));
    }
    partial(_values) {
        throw new Error("Method not implemented.");
    }
    _getPromptType() {
        return "custom_prompt_template_for_tools";
    }
    serialize() {
        throw new Error("Not implemented");
    }
}
exports.CustomPromptTemplateForTools = CustomPromptTemplateForTools;
//# sourceMappingURL=custom-prompt-template-for-tools.js.map