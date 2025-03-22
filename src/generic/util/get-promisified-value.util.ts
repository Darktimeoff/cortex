
export async function getPromisifiedValue(value: unknown): Promise<unknown> {
    if (value instanceof Promise) {
        return await value;
    }

    return value;
}