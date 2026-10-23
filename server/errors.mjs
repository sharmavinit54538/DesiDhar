export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message, details) {
  return new ApiError(400, 'BAD_REQUEST', message, details);
}

export function unauthorized(message = 'Authentication required.') {
  return new ApiError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'You do not have access to this resource.') {
  return new ApiError(403, 'FORBIDDEN', message);
}

export function notFound(message = 'Resource not found.') {
  return new ApiError(404, 'NOT_FOUND', message);
}

export function conflict(message, details) {
  return new ApiError(409, 'CONFLICT', message, details);
}

export function validationFailed(details, message = 'One or more fields are invalid.') {
  return new ApiError(422, 'VALIDATION_FAILED', message, details);
}
