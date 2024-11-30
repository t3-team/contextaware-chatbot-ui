import React, { useState } from 'react';
import { useMachine } from '@xstate/react';
import { chatMachine } from './machines/chatMachine';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { enquiryQuestions, troubleshootingQuestions } from './machines/questions';

function App() {
  const [state, send] = useMachine(chatMachine);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { 
      text: 'Hello! I am the Econ-System chatbot. Are you here for camera enquiry or troubleshooting?',
      isBot: true 
    },
  ]);

  const handleMessage = (input: string) => {
    setMessages(prev => [...prev, { text: input, isBot: false }]);

    if (state.matches('initial')) {
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('enquiry') || lowercaseInput.includes('buying')) {
        send({ type: 'SELECT_FLOW', flow: 'enquiry' });
        setMessages(prev => [...prev, { text: enquiryQuestions[0], isBot: true }]);
      } else if (lowercaseInput.includes('troubleshoot') || lowercaseInput.includes('issue')) {
        send({ type: 'SELECT_FLOW', flow: 'troubleshooting' });
        setMessages(prev => [...prev, { text: troubleshootingQuestions[0], isBot: true }]);
      } else {
        setMessages(prev => [...prev, { 
          text: "I'm not sure if you need help with camera enquiry or troubleshooting. Could you please specify?", 
          isBot: true 
        }]);
      }
    } else if (state.matches('asking')) {
      const questions = state.context.chatFlow === 'enquiry' 
        ? enquiryQuestions 
        : troubleshootingQuestions;
      
      const isLastQuestion = state.context.currentQuestionIndex === questions.length - 1;
      
      if (isLastQuestion) {
        send({ type: 'ANSWER_LAST', answer: input });
        const responseMessage = state.context.chatFlow === 'enquiry'
          ? "Thank you for providing all the information. I'll analyze your requirements and recommend suitable cameras."
          : "Thank you for providing the details. I'll analyze the issue and suggest possible solutions.";
        setMessages(prev => [...prev, { text: responseMessage, isBot: true }]);
      } else {
        send({ type: 'ANSWER', answer: input });
        setMessages(prev => [...prev, { 
          text: questions[state.context.currentQuestionIndex + 1], 
          isBot: true 
        }]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        <ChatWindow messages={messages} />
        <ChatInput onSubmit={handleMessage} />
      </div>
    </div>
  );
}

export default App;