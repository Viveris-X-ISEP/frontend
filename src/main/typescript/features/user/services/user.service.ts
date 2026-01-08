import { apiClient } from "../../../shared/api/client";
import type { CreateUserDto, User } from "../types";

export const UserService = {
  async findAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await apiClient.get<User>("/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createUser(dto: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>("/users/create", dto);
    return response.data;
  },

  async updateLastActive(token: string): Promise<User> {
    const response = await apiClient.patch<User>("/users/lastActive", null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }
};
