import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { HttpInterface } from "./http.interface";
import {createServer, Server, IncomingMessage, ServerResponse} from 'node:http'
import { ControllerFindResultInterface } from "@/controller";
import { getPromisifiedValue, isHttpMethod } from "@/generic";
import { Request } from "@/request";
import { ControllerHandlerResponseType } from "@/controller/controller.type";
import { ParserFactoryInterface } from "@/parser/parser-factory.interface";
import { isContentType } from "@/generic/type-guard/is-content-type.type-guard";
import { ParserResultType } from "@/parser/parser-factory.type";

export class HttpProtocol implements HttpInterface {
    private server: Server;

    constructor(
        protected readonly controller: ControllerRegistryInterface,
        protected readonly parserFactory: ParserFactoryInterface
    ) {
        this.server = createServer();
        this.server.on('request', this.handleRequest.bind(this));
    }

    listen(port: number, callback?: () => void): HttpInterface {
        this.server.listen(port, callback);
        return this;
    }

    close(): HttpInterface {
        this.server.close();
        return this;
    }

    private async handleRequest(req: IncomingMessage, res: ServerResponse) {
        const handler = this.getHandler(req);
        if (!handler) {
            this.handleNotFoundHandler(res);
            return;
        }

        const body = await this.getBody(req);

        const request = new Request(handler.params, req, body);
        
        const response = await getPromisifiedValue(handler.handler(request, res));
        
        this.handleResponse(response, res);
    }

    private async getBody(req: IncomingMessage): Promise<ParserResultType | null> {
        let body: ParserResultType | null = null;

        if(isContentType(req.headers['content-type'])) {
            body = await this.parserFactory.parse(req.headers['content-type'], req);
        }

        return body;
    }

    private handleResponse(response: ControllerHandlerResponseType, res: ServerResponse) {
        const contentType = res.getHeader('Content-Type') || this.getContentType(response);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Powered-By', 'Cortex');
        res.end(this.convertResponseToBody(response));
    }

    private getHandler(req: IncomingMessage): ControllerFindResultInterface | null {
        const path = req.url;
        const method = req.method;

        if (!path || !isHttpMethod(method)) {
            return null;
        }

        return this.controller.find(path, method);
    }

    private handleNotFoundHandler(res: ServerResponse) {
        res.statusCode = 404;
        res.end("Not Found");
    }

    private getContentType(response: ControllerHandlerResponseType) {
        if (typeof response === "object") {
            return "application/json";
        }

        return "text/plain";
    }

    private convertResponseToBody(response: ControllerHandlerResponseType) {
        if(response === undefined || response === null) {
            return '';
        }

        if(typeof response === 'object') {
            return JSON.stringify(response);
        }

        return response.toString();
    }
}
