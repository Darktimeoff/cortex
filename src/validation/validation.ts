import { RequestBodyType } from "@/request";
import { ValidationSchemaInterface } from "./validation.interface";
import { ValidationError } from "./validation.error";

export class Validation {
  protected async validateSchema(data: object | null | RequestBodyType | undefined, schema?: ValidationSchemaInterface) {
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