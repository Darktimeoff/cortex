import { TransportInterface } from "./transport.interface";

export class TransportConsole implements TransportInterface {
    output(message: string): void {
        console.log(message);
    }
}
