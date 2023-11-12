import { NextRequest, NextResponse } from "next/server";
import { callChain } from "@/lib/langchain";
import { Message } from "ai";
import { SalesGPT } from "@/controllers/salesgpt";
import { llm } from "@/controllers/llm";

const formatMessage = (message: Message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${
    message.content
  }`;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: Message[] = body.messages ?? [];
  console.log("Messages ", messages);
  await test();
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const question = messages[messages.length - 1].content;

  console.log("Chat history ", formattedPreviousMessages.join("\n"));

  if (!question) {
    return NextResponse.json("Error: No question in the request", {
      status: 400,
    });
  }

  try {
    const streamingTextResponse = callChain({
      question,
      chatHistory: formattedPreviousMessages.join("\n"),
    });

    return streamingTextResponse;
  } catch (error) {
    console.error("Internal server error ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}

const config = {
  salesperson_name: "Krishna Prasad",
  use_tools: true,
  product_catalog: "sample_product_catalog.txt",
};

const userQuestions = [
  'I am well, how are you? I would like to learn more about your mattresses.',
  'Yes, what materials are you mattresses made from?',
  'Yes, I am looking for a queen sized mattress. Do you have any mattresses in queen size?',
  'Yea, compare and contrast those two options, please.',
  'Great, thanks, that\'s it. I will talk to my wife and call back if she is onboard. Have a good day!'
];

async function test() {
  const sales_agent = await SalesGPT.from_llm(llm, false, config);

  // init sales agent
  await sales_agent.seed_agent();

  // Init conversation
  let stageResponse = await sales_agent.determine_conversation_stage();
  let stepResponse = await sales_agent.step();

  for(let idx in userQuestions) {
      console.log('**********Please enter user response**********\n')
      const question = userQuestions[idx]

      await sales_agent.human_step(question);
      console.log("User Ask:", question);
      stageResponse = await sales_agent.determine_conversation_stage();
  
      stepResponse = await sales_agent.step();
      console.log(sales_agent.conversation_history)
  }
}