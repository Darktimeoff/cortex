import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { HttpInterface } from "./http.interface";
import {createServer, Server, IncomingMessage, ServerResponse} from 'node:http'

export class HttpProtocol implements HttpInterface {
    private server: Server;

    constructor(protected readonly controller: ControllerRegistryInterface) {
        this.server = createServer();
        this.server.on('request', this.handleRequest.bind(this));
    }

    listen(port: number, callback?: () => void): HttpInterface {
        this.server.listen(port, callback);
        return this;
    }

    private handleRequest(req: IncomingMessage, res: ServerResponse) {
        console.log(req.url);
        console.log(req.method);
    }
}
