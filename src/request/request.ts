import { ControllerHandlerParamsType } from "@/controller";
import { RequestInterface } from "./request.interface";
import { IncomingMessage } from "http";
import { ParserResultType } from "@/parser/parser-factory.type";

export class Request implements RequestInterface<ControllerHandlerParamsType, ParserResultType | null> {
    constructor(
        private readonly _params: ControllerHandlerParamsType,
        private readonly _request: IncomingMessage,
        private readonly _body: ParserResultType | null
    ) {}

    get request(): IncomingMessage {
        return this._request;
    }

    get params(): ControllerHandlerParamsType {
        return this._params;
    }

    get body(): ParserResultType | null {
        return this._body;
    }
}
