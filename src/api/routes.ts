import { register } from "./controllers/user/register";
import { token } from "./controllers/user/token";
import { postImage } from "./controllers/user/postImage";
import { assets } from "./controllers/user/assets";
import { getTasks } from "./controllers/task/getTasks";
import { getTask } from "./controllers/task/getTask";
import { deleteTask } from "./controllers/task/deleteTask";
import { patchTask } from "./controllers/task/patchTask";
import { postTask } from "./controllers/task/postTask";
import { postTaskMetric } from "./controllers/task/postTaskMetric";
import { patchTaskMetric } from "./controllers/task/patchTaskMetrics";
import { deleteTaskMetric } from "./controllers/task/deleteTaskMetric";
import { postTaskItem } from "./controllers/task/postTaskItem";
import { patchTaskItem } from "./controllers/task/patchTaskItem";
import { deleteTaskItem } from "./controllers/task/deleteTaskItem";
import { patchMetricQuantity } from "./controllers/task/patchMetricQuantity";
import { resetPwd } from "./controllers/user/resetPwd";
import { patchUser } from "./controllers/user/patchUser";
import { forgotPwd } from "./controllers/user/forgotPwd";
import { deleteUser } from "./controllers/user/deleteUser";
import { setForgottenPwd } from "./controllers/user/setForgottenPwd";
import { getUser } from "./controllers/user/getUser";

export const routes = (<any[]>[]).concat(
    register,
    token,
    postImage,
    assets,
    getTasks,
    getTask,
    deleteTask,
    patchTask,
    postTask,
    postTaskMetric,
    patchTaskMetric,
    deleteTaskMetric,
    postTaskItem,
    patchTaskItem,
    deleteTaskItem,
    patchMetricQuantity,
    resetPwd,
    patchUser,
    forgotPwd,
    deleteUser,
    setForgottenPwd,
    getUser
);
