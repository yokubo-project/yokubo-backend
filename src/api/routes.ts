import { register as registerV1 } from "./controllers/auth/register";
import { token as tokenV1 } from "./controllers/auth/token";
import { postImage as postImageV1 } from "./controllers/user/postImage";
import { assets as assetsV1 } from "./controllers/user/assets";
import { getTasks as getTasksV1 } from "./controllers/task/getTasks";
import { getTask as getTaskV1 } from "./controllers/task/getTask";
import { postTask as postTaskV1 } from "./controllers/task/postTask";
import { deleteTask as deleteTaskV1 } from "./controllers/task/deleteTask";
import { patchTask as patchTaskV1 } from "./controllers/task/patchTask";
import { postTaskMetric as postTaskMetricV1 } from "./controllers/task/postTaskMetric";
import { patchTaskMetric as patchTaskMetricV1 } from "./controllers/task/patchTaskMetrics";
import { deleteTaskMetric as deleteTaskMetricV1 } from "./controllers/task/deleteTaskMetric";
import { postTaskItem as postTaskItemV1 } from "./controllers/task/postTaskItem";
import { patchTaskItem as patchTaskItemV1 } from "./controllers/task/patchTaskItem";
import { deleteTaskItem as deleteTaskItemV1 } from "./controllers/task/deleteTaskItem";
import { patchMetricQuantity as patchMetricQuantityV1 } from "./controllers/task/patchMetricQuantity";

export const routes = (<any[]>[]).concat(
    registerV1,
    tokenV1,
    postImageV1,
    assetsV1,
    getTasksV1,
    getTaskV1,
    deleteTaskV1,
    patchTaskV1,
    postTaskV1,
    postTaskMetricV1,
    patchTaskMetricV1,
    deleteTaskMetricV1,
    postTaskItemV1,
    patchTaskItemV1,
    deleteTaskItemV1,
    patchMetricQuantityV1
);
