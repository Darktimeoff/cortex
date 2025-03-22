import { ControllerInterface } from "@/controller/controller.interface";
import { ControllerRegistryInterface } from "./controller-registry.interface";
import { ControllerHandler } from "@/controller/controller.type";
import { HttpMethod } from "@/generic/enum/http-method.enum";

export class ControllerRegistry implements ControllerRegistryInterface {
    private controllers: ControllerInterface[] = [];

    add(controller: ControllerInterface): ControllerRegistryInterface {
        this.controllers.push(controller);
        return this;
    }

    remove(controller: ControllerInterface): ControllerRegistryInterface {
        this.controllers = this.controllers.filter(c => c !== controller);
        return this;
    }

    getHandler(path: string, method: HttpMethod): ControllerHandler | null {
        for (const controller of this.controllers) {
            const handler = controller.getHandler(path, method);
            if (handler) {
                return handler;
            }
        }
        return null;
    }
}
    
    