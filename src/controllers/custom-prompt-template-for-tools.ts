/**
 * Define a Custom Prompt Template
 */
import {
    BasePromptTemplate,
    BaseStringPromptTemplate,
    SerializedBasePromptTemplate,
    StringPromptValue,
    renderTemplate,
  } from "langchain/prompts";
  import { AgentStep, InputValues, PartialValues } from "langchain/schema";
  import { Tool } from "langchain/tools";
  
  export class CustomPromptTemplateForTools extends BaseStringPromptTemplate {
    // The template to use
    template: string;
    // The list of tools available
    tools: Tool[];
  
    constructor(args: {
      tools: Tool[];
      inputVariables: string[];
      template: string;
    }) {
      super({ inputVariables: args.inputVariables });
      this.tools = args.tools;
      this.template = args.template;
    }
  
    format(input: InputValues): Promise<string> {
      // Get the intermediate steps (AgentAction, Observation tuples)
      // Format them in a particular way
      const intermediateSteps = input.intermediate_steps as AgentStep[];
      const agentScratchpad = intermediateSteps.reduce(
        (thoughts, { action, observation }) =>
          thoughts +
          [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
        ""
      );
      //Set the agent_scratchpad variable to that value
      input["agent_scratchpad"] = agentScratchpad;
  
      // Create a tools variable from the list of tools provided
      const toolStrings = this.tools
        .map((tool) => `${tool.name}: ${tool.description}`)
        .join("\n");
      input["tools"] = toolStrings;
      // Create a list of tool names for the tools provided
      const toolNames = this.tools.map((tool) => tool.name).join("\n");
      input["tool_names"] = toolNames;
      // 构建新的输入
      const newInput = { ...input };
      /** Format the template. */
      return Promise.resolve(renderTemplate(this.template, "f-string", newInput));
    }
    partial(
      _values: PartialValues
    ): Promise<BasePromptTemplate<any, StringPromptValue, any>> {
      throw new Error("Method not implemented.");
    }
  
    _getPromptType(): string {
      return "custom_prompt_template_for_tools";
    }
  
    serialize(): SerializedBasePromptTemplate {
      throw new Error("Not implemented");
    }
  }