/**
 * 资源不存在错误
 */
export class NotFoundError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

/**
 * 无权限错误
 */
export class ForbiddenError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

/**
 * 未授权错误
 */
export class UnauthorizedError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

/**
 * 参数错误
 */
export class BadRequestError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

/**
 * 服务器内部错误
 */
export class InternalServerError extends Error {
    constructor(message = 'Internal Server Error') {
        super();
        this.message = message;
    }
}

/**
 * 连接超时
 */
export class TimeoutError extends Error {
    constructor() {
        super();
        this.message = '无法连接到服务器';
    }
}
