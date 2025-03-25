import { ProtocolEnum } from "@/protocol";

import { CortexOptionsInterface } from "./cortex.interface";
import { TransportEnum } from "@/logger";

export const DEFAULT_OPTIONS: CortexOptionsInterface = {
    protocol: ProtocolEnum.HTTP,
    logger: TransportEnum.CONSOLE
}   