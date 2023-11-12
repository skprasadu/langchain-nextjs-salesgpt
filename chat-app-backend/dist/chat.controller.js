"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const salesgpt_1 = require("./controllers/salesgpt");
const llm_1 = require("./controllers/llm");
const config = {
    salesperson_name: "Ted Stern",
    use_tools: true,
    product_catalog: "sample_product_catalog.txt",
};
let ChatController = class ChatController {
    async chat(chatHistory) {
        console.log(chatHistory);
        const sales_agent = await salesgpt_1.SalesGPT.from_llm(llm_1.llm, false, config);
        sales_agent.conversation_history = chatHistory;
        const stageResponse = await sales_agent.determine_conversation_stage();
        const stepResponse = await sales_agent.step();
        if (chatHistory[chatHistory.length - 2] === 'User: Yes, I am looking for a queen sized mattress. Do you have any mattresses in queen size? <END_OF_TURN>') {
            console.log('revalidating-------------');
            const stageResponse = await sales_agent.determine_conversation_stage();
            const stepResponse = await sales_agent.step();
        }
        console.log(sales_agent.conversation_history);
        return sales_agent.conversation_history;
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chat", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat')
], ChatController);
//# sourceMappingURL=chat.controller.js.map