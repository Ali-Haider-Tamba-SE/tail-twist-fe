export type Message = {
  id: number;
  content: string;
  is_bot: boolean;
  choices?: string[];
  image_url?: string;
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
