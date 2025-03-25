import { TransportInterface } from "./transport.interface";

export class TransportSilent implements TransportInterface {
    output(_: string): void {
    }
}
