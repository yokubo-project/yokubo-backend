import { register as registerV1 } from "./controllers/auth/register";
import { token as tokenV1 } from "./controllers/auth/token";
import { postImage as postImageV1 } from "./controllers/user/postImage";
import { assets as assetsV1 } from "./controllers/user/assets";
import { getTasks as getTasksV1 } from "./controllers/task/getTasks";
import { getTask as getTaskV1 } from "./controllers/task/getTask";
import { postTask as postTaskV1 } from "./controllers/task/postTask";
import { deleteTask as deleteTaskV1 } from "./controllers/task/deleteTask";
import { patchTask as patchTaskV1 } from "./controllers/task/patchTask";

export const routes = (<any[]>[]).concat(
    registerV1,
    tokenV1,
    postImageV1,
    assetsV1,
    getTasksV1,
    getTaskV1,
    deleteTaskV1,
    patchTaskV1,
    postTaskV1
);
