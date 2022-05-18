export class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  /**
   * 
   * @param message 
   * @param statusCode: valor default = 400
   */
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
