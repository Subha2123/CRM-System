import apiClient from '@/src/lib/apiClient';


export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
};


export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', data);
    return res.data;
  },

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const res = await apiClient.post<SignupResponse>('/auth/signup', data);
    return res.data;
  },
};