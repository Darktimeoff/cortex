import { RequestBodyType, RequestInterface } from "@/request";
import { ValidationRequestInterface, ValidationRequestSchemaInterface, ValidationSchemaInterface } from "./validation.interface";
import { ValidationError } from "./validation.error";

export class ValidationRequest implements ValidationRequestInterface {
    constructor(
        private readonly request: RequestInterface,
        private readonly schema: ValidationRequestSchemaInterface,
    ) {}

    async validate() {
        const { params, body, query } = this.request;
        const { params: paramsSchema, body: bodySchema, query: querySchema } = this.schema;


        await Promise.all([
            this.validateSchema(params, paramsSchema),
            this.validateSchema(body, bodySchema),
            this.validateSchema(query, querySchema),
        ]);
    }

    private async validateSchema(data: object | null | RequestBodyType, schema?: ValidationSchemaInterface) {
        if (schema && Object.keys(schema).length > 0) {
            try {
                const result = await schema.validate(typeof data === 'object' && data ? data : {});
                if (result.errors.length > 0) {
                    throw new ValidationError('Validation failed', result.errors);
                }
            } catch (e) {
                if (e instanceof Error && 'errors' in e) {
                    throw new ValidationError('Validation failed', e.errors as unknown[]);
                }
            }
        }
    }
}