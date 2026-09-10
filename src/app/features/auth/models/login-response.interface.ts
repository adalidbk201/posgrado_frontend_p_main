export interface LoginData {
  access: string;
}

export interface LoginResponse {
  Status: number;
  Message: string;
  Data: LoginData;
  Errores: Record<string, unknown>;
}