// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SalesGPT } from './controllers/salesgpt';
import { llm } from './controllers/llm';
import { CONVERSATION_STAGES } from './constants/conversation-stages';

const config = {
    salesperson_name: "Ted Stern",
    use_tools: true,
    product_catalog: "sample_product_catalog.txt",
};


@Controller('chat')
export class ChatController {
    @Post()
    async chat(@Body() chatHistory: string[]): Promise<any> {
        // Implement your chat completion logic here
        // Process chatHistory and return the response
        console.log(chatHistory)

        const sales_agent = await SalesGPT.from_llm(llm, false, config);

        sales_agent.conversation_history = chatHistory;
    
        let stepResponse = await sales_agent.step();
        let stageResponse = await sales_agent.determine_conversation_stage();

        if(chatHistory[chatHistory.length -1].includes('Do I need to use a tool?')){
            console.log('revalidating-------------')
            stepResponse = await sales_agent.step();    
            stageResponse = await sales_agent.determine_conversation_stage();
        }
        console.log("****", CONVERSATION_STAGES[stageResponse], stepResponse)

        //console.log(sales_agent.conversation_history)

        return { 
            conversationHistory: sales_agent.conversation_history, 
            stageResponse: CONVERSATION_STAGES[stageResponse],
            stepResponse
        };
    }
}
