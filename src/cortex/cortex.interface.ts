
export interface CortexInterface {
    listen(port: number, callback?: () => void): CortexInterface;
}