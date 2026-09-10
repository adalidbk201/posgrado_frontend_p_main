 export interface RespuestaApi<T> {
  Status: number;
  Message: string;
  Data: T;
}