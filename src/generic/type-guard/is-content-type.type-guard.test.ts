import { isContentType } from './is-content-type.type-guard';
import { ContentTypeEnum } from '@/generic/enum/content-type.enum';

describe('isContentType', () => {
  it('should return true for valid ContentTypeEnum values', () => {
    expect(isContentType(ContentTypeEnum.JSON)).toBe(true);
    expect(isContentType(ContentTypeEnum.TEXT)).toBe(true);
    expect(isContentType(ContentTypeEnum.HTML)).toBe(true);
    expect(isContentType(ContentTypeEnum.XML)).toBe(true);
    expect(isContentType(ContentTypeEnum.URL_ENCODED)).toBe(true);
    expect(isContentType(ContentTypeEnum.FORM_DATA)).toBe(true);
    expect(isContentType(ContentTypeEnum.FILE)).toBe(true);
  });

  it('should return false for invalid ContentTypeEnum values', () => {
    expect(isContentType('application/unknown')).toBe(false);
    expect(isContentType('')).toBe(false);
    expect(isContentType(undefined)).toBe(false);
    expect(isContentType(null)).toBe(false);
    expect(isContentType(123)).toBe(false);
    expect(isContentType({})).toBe(false);
    expect(isContentType([])).toBe(false);
  });
}); 