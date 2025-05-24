export interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T;
    Total?: number;
  }