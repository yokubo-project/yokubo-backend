import { register } from "./user/register";
import { token } from "./user/token";
import { postImage } from "./user/postImage";
import { assets } from "./user/assets";
import { getTasks } from "./task/getTasks";
import { getTask } from "./task/getTask";
import { deleteTask } from "./task/deleteTask";
import { patchTask } from "./task/patchTask";
import { postTask } from "./task/postTask";
import { postTaskMetric } from "./task/postTaskMetric";
import { patchTaskMetric } from "./task/patchTaskMetrics";
import { deleteTaskMetric } from "./task/deleteTaskMetric";
import { postTaskItem } from "./task/postTaskItem";
import { patchTaskItem } from "./task/patchTaskItem";
import { deleteTaskItem } from "./task/deleteTaskItem";
import { patchMetricQuantity } from "./task/patchMetricQuantity";
import { resetPwd } from "./user/resetPwd";
import { patchUser } from "./user/patchUser";
import { forgotPwd } from "./user/forgotPwd";
import { deleteUser } from "./user/deleteUser";
import { setForgottenPwd } from "./user/setForgottenPwd";
import { getUser } from "./user/getUser";

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
