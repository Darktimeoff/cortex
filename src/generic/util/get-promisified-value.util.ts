
export async function getPromisifiedValue<T>(value: T): Promise<T> {
    if (value instanceof Promise) {
        return await value;
    }

    return value;
}