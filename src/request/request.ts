import { ControllerHandlerParamsType } from "@/controller";
import { RequestInterface } from "./request.interface";
import { IncomingMessage } from "http";

export class Request<T extends ControllerHandlerParamsType = ControllerHandlerParamsType> implements RequestInterface<T> {
    constructor(
        public params: T,
        private _request: IncomingMessage
    ) {}

    get request(): IncomingMessage {
        return this._request;
    }
}
