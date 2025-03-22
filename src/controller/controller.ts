import { HttpMethod } from "@/generic/enum/http-method.enum";
import { ControllerInterface } from "./controller.interface";
import { ControllerHandler } from "./controller.type";

class Controller implements ControllerInterface {
    private routes: Map<string, {
        method: HttpMethod;
        handler: ControllerHandler;
    }> = new Map();

    constructor(
        private readonly basePath?: string
    ) {
    }

    getHandler(path: string, method: HttpMethod): ControllerHandler | null {
        const items = this.routes.entries();

        for (const [key, value] of items) {
            if (key === path && value.method === method) {
                return value.handler;
            }
        }
        
        return null;
    }

    get(path: string, cb: ControllerHandler): ControllerInterface {
        this.addRoute(path, HttpMethod.GET, cb);
        return this;
    }

    post(path: string, cb: ControllerHandler): ControllerInterface {
        this.addRoute(path, HttpMethod.POST, cb);
        return this;
    }

    put(path: string, cb: ControllerHandler): ControllerInterface {
        this.addRoute(path, HttpMethod.PUT, cb);
        return this;
    }

    delete(path: string, cb: ControllerHandler): ControllerInterface {
        this.addRoute(path, HttpMethod.DELETE, cb);
        return this;
    }

    private addRoute(path: string, method: HttpMethod, handler: ControllerHandler): void {
        this.routes.set(this.getPath(path), {
            method,
            handler
        });
    }

    private getPath(path: string): string {
        return this.basePath ? `${this.basePath}/${path}` : path;
    }
}

export default Controller;