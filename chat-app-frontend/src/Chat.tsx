// src/Chat.js
import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

function Chat() {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<any>(['Ted Stern: Hello, this is Ted Stern from Sleep Haven. How are you doing today? <END_OF_TURN>']);
  const [response, setResponse] = useState('');
  const [stepResponse, setStepResponse] = useState('');

  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    const newChatHistory = [...chatHistory, inputText];
    //setChatHistory(newChatHistory);
    setInputText('');

    try {
      const response = await axios.post('http://localhost:3000/chat', newChatHistory);
      const {conversationHistory, stageResponse, stepResponse} = response.data;

      setChatHistory(conversationHistory);
      setResponse(stageResponse)
      setStepResponse(stepResponse)
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Sales GPT Workflow</Typography>
      <div>
        {chatHistory.map((message: any, index: any) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <TextField
        label="Type your message"
        variant="outlined"
        fullWidth
        value={inputText}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>
        Send
      </Button>
      <Typography variant="h6">AI Response: {stepResponse}</Typography>
      <Typography variant="h6">Stage Response: {response}</Typography>
    </Container>
  );
}

export default Chat;
