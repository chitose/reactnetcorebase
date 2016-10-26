// Auto-generated using typewriter -> from model.tst



export class ApiResponse<T> {
  errorMessage: string | null;
  errorOptions: any;
  errorDetails: string | null;
  isBusinessError: boolean;
  data: T;
  statusCode: number;



    static ColumnNames = {
       errorMessage : 'errorMessage',
       errorOptions : 'errorOptions',
       errorDetails : 'errorDetails',
       isBusinessError : 'isBusinessError',
       data : 'data',
       statusCode : 'statusCode',
   };
}