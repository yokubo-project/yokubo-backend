import { deleteTask } from "./task/deleteTask";
import { deleteTaskItem } from "./task/deleteTaskItem";
import { deleteTaskMetric } from "./task/deleteTaskMetric";
import { getTask } from "./task/getTask";
import { getTasks } from "./task/getTasks";
import { patchMetricQuantity } from "./task/patchMetricQuantity";
import { patchTask } from "./task/patchTask";
import { patchTaskItem } from "./task/patchTaskItem";
import { patchTaskMetric } from "./task/patchTaskMetrics";
import { postTask } from "./task/postTask";
import { postTaskItem } from "./task/postTaskItem";
import { postTaskMetric } from "./task/postTaskMetric";
import { assets } from "./user/assets";
import { deleteUser } from "./user/deleteUser";
import { forgotPwd } from "./user/forgotPwd";
import { getUser } from "./user/getUser";
import { patchUser } from "./user/patchUser";
import { postImage } from "./user/postImage";
import { register } from "./user/register";
import { resetPwd } from "./user/resetPwd";
import { setForgottenPwd } from "./user/setForgottenPwd";
import { token } from "./user/token";

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
