export interface PaginacionResponse<T> {
  filas: T[];
  total: number;
}