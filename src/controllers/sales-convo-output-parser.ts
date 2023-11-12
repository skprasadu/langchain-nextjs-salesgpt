/**
 *  Define a custom Output Parser
 */
import { AgentActionOutputParser } from "langchain/agents";
import { AgentAction, AgentFinish } from "langchain/schema";
import { FormatInstructionsOptions } from "langchain/schema/output_parser";

export class SalesConvoOutputParser extends AgentActionOutputParser {
  ai_prefix: string;
  verbose: boolean;
  lc_namespace = ["langchain", "agents", "custom_llm_agent"];
  constructor(args?: { ai_prefix?: string; verbose?: boolean }) {
    super();
    this.ai_prefix = args?.ai_prefix || "AI";
    this.verbose = !!args?.verbose;
  }

  async parse(text: string): Promise<AgentAction | AgentFinish> {
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
      // finalAnswers
      return { log: text, returnValues: finalAnswers };
    }
    const regex = /Action: (.*?)[\n]*Action Input: (.*)/;
    const match = text.match(regex);
    if (!match) {
      // console.warn(`Could not parse LLM output: ${text}`);
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

  getFormatInstructions(_options?: FormatInstructionsOptions): string {
    throw new Error("Method not implemented.");
  }

  _type(): string {
    return "sales-agent";
  }
}