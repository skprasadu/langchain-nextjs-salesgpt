import { llm } from "../controllers/llm";
import { SalesGPT } from "../controllers/salesgpt";

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

(async () => {
    const sales_agent = await SalesGPT.from_llm(llm, false, config);

    // init sales agent
    await sales_agent.seed_agent();

    // Init conversation
    let stageResponse = await sales_agent.determine_conversation_stage();
    let stepResponse = await sales_agent.step();

    for(var idx in userQuestions) {
        console.log('**********Please enter user response**********\n')
        const question = userQuestions[idx];

        await sales_agent.human_step(question);
        console.log("User Ask:", question);
        stageResponse = await sales_agent.determine_conversation_stage();
    
        stepResponse = await sales_agent.step();
        console.log(sales_agent.conversation_history)
    }

})();
