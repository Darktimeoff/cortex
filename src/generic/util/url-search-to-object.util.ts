
export function urlSearchToObject(params: URLSearchParams): Record<string, string | string[]> {
    const obj: Record<string, string | string[]> = {};

    params.forEach((value, key) => {
      if (obj[key]) {
        obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
      } else {
        obj[key] = value;
      }
    });
    return obj;
}