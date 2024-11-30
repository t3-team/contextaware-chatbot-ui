export interface ChatContext {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  chatFlow: 'enquiry' | 'troubleshooting' | undefined;
}

export type ChatEvent =
  | { type: 'SELECT_FLOW'; flow: 'enquiry' | 'troubleshooting' }
  | { type: 'NEXT' }
  | { type: 'ANSWER'; answer: string }
  | { type: 'ANSWER_LAST'; answer: string }
  | { type: 'RESTART' };