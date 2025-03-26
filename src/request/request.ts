import { ControllerHandlerParamsType } from "@/controller";
import { RequestInterface } from "./request.interface";
import { IncomingMessage } from "http";
import { ParserResultType } from "@/parser/parser-factory.type";
import { urlSearchToObject } from "@/generic/util/url-search-to-object.util";

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

    get query(): Record<string, string | string[]> {
        const url = new URL(this._request.url || '/', `http://localhost`);
        return urlSearchToObject(url.searchParams);
    }
}
