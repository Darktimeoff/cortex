import { ControllerHandlerResponseType } from "@/controller/controller.type";
import { ValidationRequestInterface, ValidationRequestSchemaInterface } from "./validation.interface";
import { Validation } from "./validation";

export class ValidationResponse extends Validation implements ValidationRequestInterface {
  constructor(
    private readonly body: ControllerHandlerResponseType,
    private readonly schema: ValidationRequestSchemaInterface
  ) {
    super()
  }
  
  async validate(): Promise<void> {
    await super.validateSchema(this.body, this.schema.response);
  }
}