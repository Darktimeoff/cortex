import { ControllerRegistryInterface } from "@/controller-registry/controller-registry.interface";
import { HttpInterface } from "./http.interface";
import {createServer, Server, IncomingMessage, ServerResponse} from 'node:http'
import { ControllerFindResultInterface, ControllerHandlerParamsType } from "@/controller";
import { getPromisifiedValue, isHttpMethod } from "@/generic";
import { Request, RequestInterface } from "@/request";
import { ControllerHandlerResponseType } from "@/controller/controller.type";
import { ParserFactoryInterface } from "@/parser/parser-factory.interface";
import { isContentType } from "@/generic/type-guard/is-content-type.type-guard";
import { ParserResultType } from "@/parser/parser-factory.type";
import { Response, ResponseInterface } from "@/response";
import { LoggerInterface } from "@/logger";
import { ValidationError, ValidationRequest, ValidationRequestInterface, ValidationResponse } from "@/validation";

export class HttpProtocol implements HttpInterface {
    private server: Server;

    constructor(
        private readonly controller: ControllerRegistryInterface,
        private readonly parserFactory: ParserFactoryInterface,
        private readonly logger: LoggerInterface
    ) {
        this.server = createServer();
        this.server.on('request', this.handleRequest.bind(this));
    }

    listen(port: number, callback?: () => void): HttpInterface {
        this.server.listen(port, callback);
        this.logger.info(`Server listening at http://[::1]:${port}`);
        return this;
    }

    close(): HttpInterface {
        this.server.close();
        this.logger.info('Server closed');
        return this;
    }

    private async handleRequest(req: IncomingMessage, res: ServerResponse) {
        this.logger.info(`Request received: ${req.method} ${req.url} ${req.headers['host']} ${req?.socket?.remoteAddress} ${req?.socket?.remotePort}`);

        const handler = this.getHandler(req);
        if (!handler) {
            this.handleNotFoundHandler(res);
            return;
        }

        const { request, response } = await this.getReqAndRes(handler.params, req, res);

        const validationResult = await this.validateRequest(handler.schema, request, res);

        if(validationResult) {
            this.handleResponse(validationResult, res);
            return;
        }

        await this.executeMiddleware(req.url, request, response);
        
        const responseValue = await getPromisifiedValue(handler.handler(request, response));

        const validationResponseResult = await this.validateResponse(responseValue, handler.schema, res);

        if(validationResponseResult) {
            this.handleResponse(validationResponseResult, res);
            return;
        }

        this.handleResponse(responseValue, res);
    }

    private async validateRequest(schema: ControllerFindResultInterface['schema'], req: RequestInterface, res: ServerResponse) {
        if (!schema) {
            return;
        }

        const validationRequest = new ValidationRequest(req, schema);

        return await this.validate(validationRequest, res);
    }

    private async validateResponse(data: ControllerHandlerResponseType, schema: ControllerFindResultInterface['schema'], res: ServerResponse) {
        if (!schema) {
            return;
        }

        const validationResponse = new ValidationResponse(data, schema);

        return await this.validate(validationResponse, res);
    }

    private async validate(validate: ValidationRequestInterface, res: ServerResponse) {
        try {
            return await validate.validate();
        } catch (error) {
            if (error instanceof ValidationError) {
                this.logger.error(`Validation error ${JSON.stringify(error.errors)}`);
                res.statusCode = 400;

                return {
                    errors: error.errors
                };
            }

            this.logger.error(`Validation error: ${error}`);
            res.statusCode = 500;
            return "Internal Server Error";
        }
    }

    private async executeMiddleware(path: string | undefined, req: RequestInterface, res: ResponseInterface) {
        const middlewareChain = this.controller.findAllMiddlewareByPath(path || '/');
        await middlewareChain.execute(req, res);
    }

    private async getReqAndRes(params: ControllerHandlerParamsType, req: IncomingMessage, res: ServerResponse): Promise<{ request: RequestInterface, response: ResponseInterface }> {
        const body = await this.getBody(req);

        const request = new Request(params, req, body);
        const response = new Response(res);

        return { request, response };
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
        this.logger.info(`Response sent: ${res.statusCode} ${res.statusMessage} ${res.getHeader('Content-Type')}`);
    }

    private getHandler(req: IncomingMessage): ControllerFindResultInterface | null {
        let path = req.url;
        const method = req.method;

        if (!path || !isHttpMethod(method)) {
            return null;
        }
        const url = new URL(path, `http://localhost`);
        path = url.pathname;

        return this.controller.find(path, method);
    }

    private handleNotFoundHandler(res: ServerResponse) {
        res.statusCode = 404;
        res.end("Not Found");
        this.logger.error(`Handler not found: ${res.statusCode} ${res.statusMessage}`);
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
