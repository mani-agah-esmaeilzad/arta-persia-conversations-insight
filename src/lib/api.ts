const API_BASE_URL = 'https://your-api-domain.com/api';

// Types
export interface User {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  age?: number;
  educationLevel?: string;
  workExperience?: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface Assessment {
  id: number;
  userId: number;
  skillId: number;
  status: 'started' | 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: number;
  assessmentId: number;
  messageType: 'user' | 'bot';
  content: string;
  timestamp: string;
  type?: 'user' | 'bot'; // For backward compatibility
}

export interface AnalysisResult {
  id: number;
  assessmentId: number;
  analysis: string;
  score?: number;
  recommendations: string;
}

// Auth API
export const authApi = {
  sendOtp: async (phoneNumber: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return response.json();
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    });
    return response.json();
  },

  register: async (userData: Omit<User, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

// Skills API
export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    const response = await fetch(`${API_BASE_URL}/skills`);
    return response.json();
  }
};

// Assessment API
export const assessmentApi = {
  start: async (userId: number, skillId: number): Promise<Assessment> => {
    const response = await fetch(`${API_BASE_URL}/assessments/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skillId })
    });
    return response.json();
  },

  sendMessage: async (assessmentId: number, message: string) => {
    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return response.json();
  },

  getMessages: async (assessmentId: number): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/messages`);
    return response.json();
  }
};

// Results API
export const resultsApi = {
  getByAssessment: async (assessmentId: number): Promise<AnalysisResult> => {
    const response = await fetch(`${API_BASE_URL}/results/assessment/${assessmentId}`);
    return response.json();
  },

  getByUser: async (userId: number): Promise<AnalysisResult[]> => {
    const response = await fetch(`${API_BASE_URL}/results/user/${userId}`);
    return response.json();
  }
};