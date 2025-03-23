import { ControllerFindResultInterface, ControllerInterface } from "@/controller/controller.interface";
import { ControllerRegistryInterface } from "./controller-registry.interface";
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

    find(path: string, method: HttpMethod): ControllerFindResultInterface | null {
        for (const controller of this.controllers) {
            const handler = controller.find(path, method);
            if (handler) {
                return handler;
            }
        }
        return null;
    }
}
    
    