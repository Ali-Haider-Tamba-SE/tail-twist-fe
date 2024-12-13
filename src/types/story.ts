export type Message = {
  id: number;
  content: string;
  isBot: boolean;
  choices?: string[];
};

export type Story = {
  id: number;
  title: string;
  status: 'in_progress' | 'completed';
  created_at: Date;
};

export type User = {
  id: number;
  email: string;
  name: string;
};
