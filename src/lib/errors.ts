export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'PAYMENT_ERROR', 402, details);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401);
  }
}

export function handleAPIError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return new Response(JSON.stringify({
      error: error.message,
      code: error.code,
      details: error.details,
    }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (error instanceof Error) {
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    error: 'An unknown error occurred',
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
