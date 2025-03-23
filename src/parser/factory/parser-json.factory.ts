import { IncomingMessage } from "node:http";
import { ParserFactoryInterface } from "../parser-factory.interface";
import { getDataFromStream } from "@/generic/util/get-data-from-stream.util";
import { ContentTypeEnum } from "@/generic/enum/content-type.enum";

export class ParserJsonFactory implements ParserFactoryInterface<object> {
    async parse(_: ContentTypeEnum, req: IncomingMessage): Promise<object> {
        const body = await getDataFromStream(req);
        return JSON.parse(body.toString());
    }
}