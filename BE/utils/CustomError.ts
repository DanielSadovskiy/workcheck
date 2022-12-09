export class CustomError extends Error {
    private status;
    constructor(status: number, message:string) {
      super(message);
      this.status = status;
    }
  }
  
 