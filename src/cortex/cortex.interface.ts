import { ControllerInterface } from "@/controller";

export interface CortexInterface extends Omit<ControllerInterface<CortexInterface>, 'find'> {
    listen(port: number, callback?: () => void): CortexInterface;
    close(): CortexInterface;
    add(controller: ControllerInterface): CortexInterface;
}