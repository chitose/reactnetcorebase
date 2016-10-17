// Auto-generated using typewriter -> from model.tst



export interface ApiResponse<T> {
  errorMessage: string;
  errorOptions: any;
  errorDetails: string;
  isBusinessError: boolean;
  data: T;
  statusCode: number;
}

