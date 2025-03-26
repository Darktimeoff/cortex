
export class ValidationError extends Error {
    constructor(message: string, public readonly errors: unknown[]) {
        super(message);
    }
}
