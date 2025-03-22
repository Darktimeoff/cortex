import { ControllerInterface } from "@/controller/controller.interface";

export interface ControllerRegistryInterface extends Pick<ControllerInterface, 'getHandler'> {
    add(controller: ControllerInterface): ControllerRegistryInterface;
    remove(controller: ControllerInterface): ControllerRegistryInterface;
}