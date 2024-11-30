import { createMachine } from 'xstate';
import { ChatContext, ChatEvent } from './types';
import { enquiryQuestions, troubleshootingQuestions } from './questions';

export const chatMachine = createMachine<ChatContext, ChatEvent>({
  id: 'chat',
  initial: 'initial',
  context: {
    currentQuestionIndex: 0,
    answers: {},
    chatFlow: undefined,
  },
  states: {
    initial: {
      on: {
        SELECT_FLOW: {
          target: 'asking',
          actions: (context, event) => {
            context.chatFlow = event.flow;
          },
        },
      },
    },
    asking: {
      on: {
        ANSWER: {
          target: 'asking',
          actions: (context, event) => {
            const questions = context.chatFlow === 'enquiry' 
              ? enquiryQuestions 
              : troubleshootingQuestions;
            
            if ('answer' in event) {
              context.answers[questions[context.currentQuestionIndex]] = event.answer;
              context.currentQuestionIndex++;
            }
          },
          cond: (context) => {
            const questions = context.chatFlow === 'enquiry' 
              ? enquiryQuestions 
              : troubleshootingQuestions;
            return context.currentQuestionIndex < questions.length - 1;
          },
        },
        ANSWER_LAST: {
          target: 'summary',
          actions: (context, event) => {
            const questions = context.chatFlow === 'enquiry' 
              ? enquiryQuestions 
              : troubleshootingQuestions;
            
            if ('answer' in event) {
              context.answers[questions[context.currentQuestionIndex]] = event.answer;
            }
          },
        },
      },
    },
    summary: {
      on: {
        RESTART: {
          target: 'initial',
          actions: (context) => {
            context.currentQuestionIndex = 0;
            context.answers = {};
            context.chatFlow = undefined;
          },
        },
      },
    },
  },
});