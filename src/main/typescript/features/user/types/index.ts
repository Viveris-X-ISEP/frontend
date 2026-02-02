export interface User {
  id: number;
  email: string;
  passwordHash: string;
  profilePictureUrl: string;
  username: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  role: string; // Adjust to use an enum if roles are predefined
  lastActive: string; // ISO string format
}

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  profilePictureUrl?: string;
  username: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}
