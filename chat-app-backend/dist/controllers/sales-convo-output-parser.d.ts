import { AgentActionOutputParser } from "langchain/agents";
import { AgentAction, AgentFinish } from "langchain/schema";
import { FormatInstructionsOptions } from "langchain/schema/output_parser";
export declare class SalesConvoOutputParser extends AgentActionOutputParser {
    ai_prefix: string;
    verbose: boolean;
    lc_namespace: string[];
    constructor(args?: {
        ai_prefix?: string;
        verbose?: boolean;
    });
    parse(text: string): Promise<AgentAction | AgentFinish>;
    getFormatInstructions(_options?: FormatInstructionsOptions): string;
    _type(): string;
}
