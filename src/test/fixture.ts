import * as moment from "moment";

const nextYear = moment().add(1, "years").toDate();

////////////////////////////
//        Users           //
////////////////////////////

export const user1 = {
    uid: "12ab55e3-1418-418b-abbf-35d8cc68d477",
    username: "user1@test.com",
    password: "$2a$10$it67eRCyDYm9NY6DZ0aoee7OA/jbBRSSCgEqSOKm1pHKdKrlgBEzu", // mynewpwd42
    name: "User 1"
};
export const user1Pwd = "mynewpwd42";

export const user2 = {
    uid: "368d83d6-d367-4dc4-a6a2-a6cc167604f4",
    username: "user2@test.com",
    password: "$2a$10$it67eRCyDYm9NY6DZ0aoee7OA/jbBRSSCgEqSOKm1pHKdKrlgBEzu", // mynewpwd42
    name: "User 2"
};
export const user2Pwd = "mynewpwd42";

////////////////////////////
//      Access Tokens     //
////////////////////////////

export const accessToken1 = {
    UserUid: user1.uid,
    token: "57e97a9a-0928-11e5-9ca6-6c4008ac6d80",
    validUntil: nextYear
};

export const accessToken2 = {
    UserUid: user2.uid,
    token: "de2393f0-0e8e-11e5-8a53-6c4008ac6d80",
    validUntil: nextYear
};


////////////////////////////
//     Refresh Tokens     //
////////////////////////////

export const refreshToken1 = {
    UserUid: user1.uid,
    token: "d82daf43-75f2-4564-9812-015c60ed4982",
};

export const refreshToken2 = {
    UserUid: user2.uid,
    token: "e75078ea-7b34-4a4e-815c-e2f809d55caa",
};


////////////////////////////
//          Images        //
////////////////////////////

export const image1 = {
    uid: "0352a729-efe9-4ec0-bec1-f921931b75a2",
    file: "www.test.com/image1",
};

export const image2 = {
    uid: "89d317b7-2edb-41cf-822f-2f002d3b394e",
    file: "www.test.com/profileImage1",
};


////////////////////////////
//         Tasks          //
////////////////////////////

export const task1 = {
    uid: "5db815b9-8e02-49bd-a42c-dd516b8468d9",
    name: "Task1",
    ImageUid: image1.uid,
    UserUid: user1.uid
};

export const task2 = {
    uid: "517b620c-71a4-44c9-abe6-cfea9a4826b3",
    name: "Task2",
    ImageUid: image1.uid,
    UserUid: user1.uid
};

export const task3 = {
    uid: "bae98bf7-8728-41a6-964c-04bca64da420",
    name: "Task3",
    ImageUid: image1.uid,
    UserUid: user2.uid
};


////////////////////////////
//     Task Metrics       //
////////////////////////////

export const taskMetric1 = {
    uid: "7801cee9-6627-4eea-a1cd-2383036c7039",
    name: "Metric1",
    unit: "Unit1",
    TaskUid: task1.uid
};

export const taskMetric2 = {
    uid: "2b7cd65c-29cb-4043-a01b-76b6ad501a1c",
    name: "Metric2",
    unit: "Unit2",
    TaskUid: task1.uid
};

export const taskMetric3 = {
    uid: "4b25ed3c-e9f6-4580-bb8d-618da31fd56f",
    name: "Metric3",
    unit: "Unit3",
    TaskUid: task3.uid
};


////////////////////////////
//       Task Items       //
////////////////////////////

export const taskItem1 = {
    uid: "5850d3f5-393e-4988-ac5b-316352abe6d8",
    name: "Item1",
    desc: "Desc1",
    period: [
        moment().subtract(7, "hours").toISOString(),
        moment().toISOString()
    ],
    TaskUid: task1.uid
};

export const taskItem2 = {
    uid: "918d4497-0fe8-47d2-b60e-3d2990befd61",
    name: "Item2",
    TaskUid: task1.uid
};


////////////////////////////
//    Metric Quantities   //
////////////////////////////

export const metricQuantity1 = {
    uid: "6cc8aea1-ff01-4a35-be07-db57e76f0f3c",
    TaskItemUid: taskItem1.uid,
    TaskMetricUid: taskMetric1.uid,
    quantity: 1
};

export const metricQuantity2 = {
    uid: "87f385f3-0268-47fb-8528-abdef3a21cfa",
    TaskItemUid: taskItem1.uid,
    TaskMetricUid: taskMetric2.uid,
    quantity: 2
};


////////////////////////////
// FIXTURE //
////////////////////////////

const fixture = {

    User: [user1, user2],

    AccessToken: [accessToken1, accessToken2],

    RefreshToken: [refreshToken1, refreshToken2],

    Image: [image1, image2],

    Task: [task1, task2, task3],

    TaskMetric: [taskMetric1, taskMetric2, taskMetric3],

    TaskItem: [taskItem1, taskItem2],

    MetricQuantity: [metricQuantity1, metricQuantity2]

};

export default fixture;
