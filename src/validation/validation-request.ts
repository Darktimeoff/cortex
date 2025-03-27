import {  RequestInterface } from "@/request";
import { ValidationRequestInterface, ValidationRequestSchemaInterface } from "./validation.interface";
import { Validation } from "./validation";

export class ValidationRequest extends Validation implements ValidationRequestInterface {
    constructor(
        private readonly request: RequestInterface,
        private readonly schema: ValidationRequestSchemaInterface,
    ) {
      super()
    }

    async validate() {
        const { params, body, query } = this.request;
        const { params: paramsSchema, body: bodySchema, query: querySchema } = this.schema;


        await Promise.all([
            this.validateSchema(params, paramsSchema),
            this.validateSchema(body, bodySchema),
            this.validateSchema(query, querySchema),
        ]);
    }
}