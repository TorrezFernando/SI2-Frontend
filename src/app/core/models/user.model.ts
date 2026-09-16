export interface User {
  ci: string;
  id_empresa: number | null;
  nombre: string;
  correo: string;
  telefono?: string | null;
  id_rol: number;
  permisos?: string[];
}

export interface UserLoginRequest {
  correo: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserRegisterRequest {
  ci: string;
  id_empresa?: number | null;
  nombre: string;
  correo: string;
  telefono?: string;
  id_rol: number;
  password: string;
}

export interface PasswordUpdateRequest {
  nueva_password: string;
}

export interface ForgotPasswordRequest {
  correo: string;
}
