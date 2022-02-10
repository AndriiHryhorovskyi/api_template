'use strict';

class Exception extends Error {
  constructor(args = {}) {
    super();
    if (!args.message) throw new Error('"message" is required');
    this.message = args.message;
    this.description = args.description;
  }
}

class InputError extends Exception {
  constructor(params) {
    super(params);
    this.httpStatus = 400;
    this.data.field = params.field;
  }
}

class TooManyRequests extends Exception {
  constructor({
    message = 'Too Many Requests',
    description = 'You sent to many requests. Please try again in a few minutes',
  } = {}) {
    super({ message, description });
    this.httpStatus = 429;
  }
}

class NotFound extends Exception {
  constructor({ message = 'Not Found', description } = {}) {
    super({ message, description });
    this.httpStatus = 404;
  }
}

class Forbidden extends Exception {
  constructor({ message = 'Forbidden', description } = {}) {
    super({ message, description });
    this.httpStatus = 403;
  }
}

class Unauthorized extends Exception {
  constructor({ message = 'Unauthorized', description, context } = {}) {
    super({ message, description, context });
    this.httpStatus = 401;
  }
}

class Conflict extends Exception {
  constructor({ message = 'Conflict', description } = {}) {
    super({ message, description });
    this.httpStatus = 409;
  }
}

module.exports = {
  Exception,
  InputError,
  TooManyRequests,
  NotFound,
  Forbidden,
  Unauthorized,
  Conflict,
};
