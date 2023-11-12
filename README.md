# Introduction

This application uses [OpenAI](https://platform.openai.com/playground) and [Langchain Javascript framework](https://js.langchain.com/) and demonstrates [SalesGPT Example](https://js.langchain.com/docs/use_cases/autonomous_agents/sales_gpt). This is a good starting point to demonstrate a work flow using a AI platform like Langchain Javascript. This uses React on the frontend and NestJs on the backend to control the workflow.  

# Steps to test and code

On the backend 

* Go to [OpenAI](https://platform.openai.com/playground) and OpenAI key and set it in the .env file in chat-app-backend folder
* Copy a new file from .env.example to .env file and the key
* Run `npm i`
* Run `npm start`

On the frontend

* Run `npm i`
* Run `npm run dev`

Ask the below questions to test the workflow,

* I am well, how are you? I would like to learn more about your mattresses.
* Yes, what materials are you mattresses made from?
* Yes, I am looking for a queen sized mattress. Do you have any mattresses in queen size?
* Yea, compare and contrast those two options, please.
* Great, thanks, that\'s it. I will talk to my wife and call back if she is onboard. Have a good day!

