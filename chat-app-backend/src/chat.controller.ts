// src/chat/chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SalesGPT } from './controllers/salesgpt';
import { llm } from './controllers/llm';

const config = {
    salesperson_name: "Ted Stern",
    use_tools: true,
    product_catalog: "sample_product_catalog.txt",
};


@Controller('chat')
export class ChatController {
    @Post()
    async chat(@Body() chatHistory: string[]): Promise<string[]> {
        // Implement your chat completion logic here
        // Process chatHistory and return the response
        console.log(chatHistory)

        const sales_agent = await SalesGPT.from_llm(llm, false, config);

        sales_agent.conversation_history = chatHistory;
    
        const stageResponse = await sales_agent.determine_conversation_stage();
        const stepResponse = await sales_agent.step();

        if(chatHistory[chatHistory.length -1].includes('Do I need to use a tool? Yes')){
            console.log('revalidating-------------')
            const stageResponse = await sales_agent.determine_conversation_stage();
            const stepResponse = await sales_agent.step();    
        }

        console.log(sales_agent.conversation_history)

        return sales_agent.conversation_history;
    }
}
