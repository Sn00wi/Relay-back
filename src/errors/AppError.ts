// обработка ошибок, принимает код ошибки и текст ошибки
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
