import { ContentTypeEnum } from "@/generic/enum/content-type.enum";

export const isContentType = (contentType: unknown): contentType is ContentTypeEnum => {
    return typeof contentType === 'string' && Object.values(ContentTypeEnum).includes(contentType as ContentTypeEnum);
}