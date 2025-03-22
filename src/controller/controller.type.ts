export type ControllerHandler = <T>(req: Request, res: Response) => T | Promise<T>;