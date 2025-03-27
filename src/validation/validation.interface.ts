type ValidationResult = {
    errors: unknown[];
}

export type ValidationSchemaInterface = object & {
    validate(schema: object): Promise<ValidationResult> | ValidationResult;
}

export interface ValidationRequestSchemaInterface {
    params?: ValidationSchemaInterface;
    body?: ValidationSchemaInterface;
    query?: ValidationSchemaInterface;
    response?: ValidationSchemaInterface;
}

export interface ValidationRequestInterface {
    validate(): Promise<void>;
}