import { ServerResponse } from "node:http";
import { ResponseInterface } from "./response.interface";

export class Response implements ResponseInterface {
    constructor(
        private readonly _response: ServerResponse
    ) {}
    
    get response() {
        return this._response;
    }
}