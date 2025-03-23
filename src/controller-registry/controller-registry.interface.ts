import { ControllerInterface } from "@/controller/controller.interface";

export interface ControllerRegistryInterface extends Pick<ControllerInterface, 'find'> {
    add(controller: ControllerInterface): ControllerRegistryInterface;
    remove(controller: ControllerInterface): ControllerRegistryInterface;
}