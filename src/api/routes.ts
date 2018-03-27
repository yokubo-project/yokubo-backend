import { register as registerV1 } from "./controllers/v1/register";
import { token as tokenV1 } from "./controllers/v1/token";

export const routes = (<any[]>[]).concat(
    registerV1,
    tokenV1
);
