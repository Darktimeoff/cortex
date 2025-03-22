import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerHandler } from "./controller.type";

export interface ControllerInterface {
    getHandler(path: string, method: HttpMethod): ControllerHandler | null;
    get(path: string, cb: ControllerHandler): void;
    post(path: string, cb: ControllerHandler): void;
    put(path: string, cb: ControllerHandler): void;
    delete(path: string, cb: ControllerHandler): void;
}