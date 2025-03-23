import { Readable } from "node:stream";

export function getDataFromStream(stream: Readable) {
    const data: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
        stream.on('data', (chunk) => {
            data.push(chunk);
        });
        stream.on('end', () => {
            resolve(Buffer.concat(data));
        });
        stream.on('error', (error) => {
            reject(error);
        });
    });
}
