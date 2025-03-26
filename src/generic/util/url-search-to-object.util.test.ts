import { urlSearchToObject } from './url-search-to-object.util';

describe('urlSearchToObject', () => {
  it('should convert URLSearchParams to an object', () => {
    const params = new URLSearchParams('name=John&age=30');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({
      name: 'John',
      age: '30'
    });
  });

  it('should handle empty URLSearchParams', () => {
    const params = new URLSearchParams('');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({});
  });

  it('should handle multiple values for the same key', () => {
    const params = new URLSearchParams('color=red&color=blue&color=green');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({
      color: ['red', 'blue', 'green']
    });
  });

  it('should handle keys without values', () => {
    const params = new URLSearchParams('empty&name=John');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({
      empty: '',
      name: 'John'
    });
  });

  it('should handle complex query strings', () => {
    const params = new URLSearchParams('filter[name]=John&filter[age]=30&sort=asc&page=1&limit=10');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({
      'filter[name]': 'John',
      'filter[age]': '30',
      sort: 'asc',
      page: '1',
      limit: '10'
    });
  });

  it('should handle special characters in values', () => {
    const params = new URLSearchParams('query=hello+world&search=a%26b');
    const result = urlSearchToObject(params);
    
    expect(result).toEqual({
      query: 'hello world',
      search: 'a&b'
    });
  });
}); 