export interface AIQuestion {
  id: string;
  text: string;
  type: 'yes_no' | 'multiple_choice' | 'text';
  options: string[];
  nextQuestionMap: Record<string, string>;
} 