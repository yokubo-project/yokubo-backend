import { register as registerV1 } from "./controllers/auth/register";
import { token as tokenV1 } from "./controllers/auth/token";
import { postImage as postImageV1 } from "./controllers/user/postImage";
import { assets as assetsV1 } from "./controllers/user/assets";

export const routes = (<any[]>[]).concat(
    registerV1,
    tokenV1,
    postImageV1,
    assetsV1
);
