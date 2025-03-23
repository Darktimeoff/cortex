import { ContentTypeEnum } from "@/generic/enum/content-type.enum";

export class ParserNotFoundError extends Error {
    constructor(message: string, public readonly contentType: ContentTypeEnum) {
        super(message);
    }
}

