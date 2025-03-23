
export interface ProtocolInterface {
    listen(port: number, callback?: () => void): ProtocolInterface;
    close(): ProtocolInterface;
}