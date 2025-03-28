import { ContentTypeEnum } from "@/generic/enum/content-type.enum";
import { ParserFactoryInterface } from "./parser-factory.interface";
import { IncomingMessage } from "node:http";
import { ParserJsonFactory } from "./factory/parser-json.factory";
import { ParserTextFactory } from "./factory/parser-text.factory";
import { ParserNotFoundError } from "./parser.error";
import { ParserResultType } from "./parser-factory.type";

export class ParserFactory implements ParserFactoryInterface<ParserResultType> {
    private parsers: Map<ContentTypeEnum, ParserFactoryInterface<ParserResultType>> = new Map([
        [ContentTypeEnum.JSON, new ParserJsonFactory()],
        [ContentTypeEnum.TEXT, new ParserTextFactory()],
    ]);

    async parse(contentType: ContentTypeEnum, req: IncomingMessage): Promise<ParserResultType> {
        const parser = this.parsers.get(contentType);
        if (!parser) {
            throw new ParserNotFoundError(`No parser found for content type: ${contentType}`, contentType);
        }
        return await parser.parse(contentType, req);
    }
}
