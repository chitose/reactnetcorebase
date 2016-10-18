// Auto-generated using typewriter -> from model.tst



export class ApiResponse<T> {
  errorMessage: string;
  errorOptions: any;
  errorDetails: string;
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