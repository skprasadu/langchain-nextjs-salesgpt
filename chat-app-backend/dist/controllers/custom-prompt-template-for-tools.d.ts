import { BasePromptTemplate, BaseStringPromptTemplate, SerializedBasePromptTemplate, StringPromptValue } from "langchain/prompts";
import { InputValues, PartialValues } from "langchain/schema";
import { Tool } from "langchain/tools";
export declare class CustomPromptTemplateForTools extends BaseStringPromptTemplate {
    template: string;
    tools: Tool[];
    constructor(args: {
        tools: Tool[];
        inputVariables: string[];
        template: string;
    });
    format(input: InputValues): Promise<string>;
    partial(_values: PartialValues): Promise<BasePromptTemplate<any, StringPromptValue, any>>;
    _getPromptType(): string;
    serialize(): SerializedBasePromptTemplate;
}
