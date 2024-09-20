import { SwaggerException } from '../services/backend/client.generated';

export class AppError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof SwaggerException) {
    return new AppError(error.message, error.status);
  }
  if (error instanceof Error) {
    return new AppError(error.message);
  }
  return new AppError('An unknown error occurred');
}