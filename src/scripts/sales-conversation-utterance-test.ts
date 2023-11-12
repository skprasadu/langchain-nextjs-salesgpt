import { sales_conversation_utterance_chain } from "../controllers/chains";
import { CONVERSATION_STAGES } from "../constants/conversation-stages";

sales_conversation_utterance_chain.call({
    salesperson_name: "Ted Lasso",
    salesperson_role: "Business Development Representative",
    company_name: "Sleep Haven",
    company_business:
      "Sleep Haven is a premium mattress company that provides customers with the most comfortable and supportive sleeping experience possible. We offer a range of high-quality mattresses, pillows, and bedding accessories that are designed to meet the unique needs of our customers.",
    company_values:
      "Our mission at Sleep Haven is to help people achieve a better night's sleep by providing them with the best possible sleep solutions. We believe that quality sleep is essential to overall health and well-being, and we are committed to helping our customers achieve optimal sleep by offering exceptional products and customer service.",
    conversation_purpose:
      "find out whether they are looking to achieve better sleep via buying a premier mattress.",
    conversation_history:
      "Hello, this is Ted Lasso from Sleep Haven. How are you doing today? <END_OF_TURN>\nUser: I am well, howe are you?<END_OF_TURN>",
    conversation_type: "call",
    conversation_stage: CONVERSATION_STAGES["1"],
  });