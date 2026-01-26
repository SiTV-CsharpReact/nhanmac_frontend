export interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T | null;
    Total?: number;
  }