import { apiClient } from "../../../shared/api/client";
import type { Mission } from "../types";

const API_URL = "/missions";

export const getAllMissions = async (): Promise<Mission[]> => {
  const response = await apiClient.get<Mission[]>(API_URL);
  return response.data;
};

export const getMissionById = async (id: number): Promise<Mission> => {
  const response = await apiClient.get<Mission>(`${API_URL}/${id}`);
  return response.data;
};

export const createMission = async (mission: Mission): Promise<Mission> => {
  const response = await apiClient.post<Mission>(API_URL, mission);
  return response.data;
};

export const updateMission = async (id: number, mission: Mission): Promise<Mission> => {
  const response = await apiClient.put<Mission>(`${API_URL}/${id}`, mission);
  return response.data;
};

export const deleteMission = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_URL}/${id}`);
};
