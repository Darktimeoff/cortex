import { ContentTypeEnum } from "@/generic/enum/content-type.enum";
import { IncomingMessage } from "node:http";
import { ParserResultType } from "./parser-factory.type";

export interface ParserFactoryInterface<T extends ParserResultType = ParserResultType> {
    parse(contentType: ContentTypeEnum, req: IncomingMessage): Promise<T>;
}