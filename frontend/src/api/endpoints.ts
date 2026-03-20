import api from './axios'

export interface AuthResponse {
  access: string
  refresh: string
  user: { id: number; email: string; username: string }
}

export const register = (email: string, username: string, password: string, password2: string) =>
  api.post<AuthResponse>('/auth/register/', { email, username, password, password2 })

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login/', { email, password })

export const logout = (refresh: string) =>
  api.post('/auth/logout/', { refresh })

export const getMe = () => api.get('/auth/me/')

export const generateCode = (idea: string, project_type: string, complexity: string) =>
  api.post<{ code: string }>('/generate/', { idea, project_type, complexity })

export const getHistory = () => api.get('/history/')
