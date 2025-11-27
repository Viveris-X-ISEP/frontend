// ===========================================
// REQUEST PAYLOADS (sent to backend)
// ===========================================

/**
 * Matches backend: AuthRequestDto
 * POST /auth/login
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Matches backend: RegisterRequestDto
 * POST /auth/register
 */
export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
}

/**
 * Frontend-only: includes confirmPassword for validation
 */
export interface SignUpCredentials extends SignUpPayload {
  confirmPassword: string;
}

/**
 * Matches backend: RefreshTokenDto
 * POST /auth/refresh
 */
export interface RefreshTokenPayload {
  refreshToken: string;
}

// ===========================================
// RESPONSE PAYLOADS (received from backend)
// ===========================================

/**
 * Matches backend: AuthResponseDto
 * Returned by /auth/login, /auth/register, /auth/refresh
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
}

// ===========================================
// FORM STATE (frontend-only)
// ===========================================

export interface AuthFormState {
  isLoading: boolean;
  error: string | null;
}
