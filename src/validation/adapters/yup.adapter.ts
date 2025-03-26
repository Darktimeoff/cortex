import { ValidationSchemaInterface } from "../validation.interface";
import * as yup from 'yup';

export class YupSchemaAdapter implements ValidationSchemaInterface {
    constructor(private schema: yup.Schema) {}

  
    async validate(data: object): Promise<{ errors: unknown[] }> {
        try {
            await this.schema.validate(data, { abortEarly: false });
       
            return { errors: [] };
        } catch (error) {
            if (error instanceof yup.ValidationError) {
       
                return {
                    errors: error.inner.map(err => ({
                        path: err.path,
                        message: err.message,
                        value: err.value
                    }))
                };
            }
            
            return {
                errors: [{
                    message: error instanceof Error ? error.message : 'Unknown validation error'
                }]
            };
        }
    }
}

export function adaptYupSchema(schema: yup.Schema): ValidationSchemaInterface {
    return new YupSchemaAdapter(schema);
} 