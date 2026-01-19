export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  learning_goals?: string;
  preferred_topics?: string[];
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  full_name: string;
  password: string;
  learning_goals?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  title: string;
  topic?: string;
  created_at: string;
  message_count: number;
}

export interface ConversationDetail {
  id: number;
  title: string;
  topic?: string;
  created_at: string;
  messages: Message[];
}

export interface PracticeSession {
  id: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  problem_text: string;
  user_answer?: string;
  is_correct?: boolean;
  feedback?: string;
  score?: number;
  created_at: string;
}

export interface GenerateProblemRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GeneratedProblem {
  session_id: number;
  problem: {
    problem_text: string;
    hints: string[];
    difficulty: string;
    topic: string;
  };
}

export interface LearningStats {
  total_conversations: number;
  total_practice_sessions: number;
  practice_sessions_completed: number;
  average_score: number;
  topics_practiced: string[];
  recent_activity: any[];
  progress_by_topic: Record<string, any>;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  score: number;
  feedback: string;
}
