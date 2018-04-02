import * as moment from "moment";

const nextYear = moment().add(1, "years").toDate();

export const uids = {

    user1: "12ab55e3-1418-418b-abbf-35d8cc68d477",
    user2: "368d83d6-d367-4dc4-a6a2-a6cc167604f4",

    accessToken1: "57e97a9a-0928-11e5-9ca6-6c4008ac6d80",
    accessToken2: "de2393f0-0e8e-11e5-8a53-6c4008ac6d80",

    refreshToken1: "d82daf43-75f2-4564-9812-015c60ed4982",
    refreshToken2: "e75078ea-7b34-4a4e-815c-e2f809d55caa",

    image1: "0352a729-efe9-4ec0-bec1-f921931b75a2",
    userProfileImage1: "89d317b7-2edb-41cf-822f-2f002d3b394e",

    task1: "5db815b9-8e02-49bd-a42c-dd516b8468d9",
    task2: "517b620c-71a4-44c9-abe6-cfea9a4826b3",
    task3: "bae98bf7-8728-41a6-964c-04bca64da420",

    taskMetric1: "7801cee9-6627-4eea-a1cd-2383036c7039",
    taskMetric2: "2b7cd65c-29cb-4043-a01b-76b6ad501a1c",
    taskMetric3: "4b25ed3c-e9f6-4580-bb8d-618da31fd56f",

    taskItem1: "5850d3f5-393e-4988-ac5b-316352abe6d8",
    taskItem2: "918d4497-0fe8-47d2-b60e-3d2990befd61",

};

const fixture = {

    User: [{
        uid: uids.user1,
        username: "user1@test.com",
        password: "PASSWORD_HASH",
    }, {
        uid: uids.user2,
        username: "user2@test.com",
        password: "PASSWORD_HASH",
    }],

    AppUserProfile: [{
        UserUid: uids.user1,
        name: "User 1"
    }, {
        UserUid: uids.user2,
        name: "User 2"
    }],

    AccessToken: [{
        UserUid: uids.user1,
        token: uids.accessToken1,
        validUntil: nextYear
    }, {
        UserUid: uids.user2,
        token: uids.accessToken2,
        validUntil: nextYear
    }],

    RefreshToken: [{
        UserUid: uids.user1,
        token: uids.refreshToken1,
    }, {
        UserUid: uids.user2,
        token: uids.refreshToken2,
    }],

    Image: [{
        uid: uids.image1,
        file: "www.test.com/image1",
    }, {
        uid: uids.userProfileImage1,
        file: "www.test.com/profileImage1",
    }],

    Task: [{
        uid: uids.task1,
        name: "Task1",
        ImageUid: uids.image1,
        UserUid: uids.user1
    }, {
        uid: uids.task2,
        name: "Task2",
        ImageUid: uids.image1,
        UserUid: uids.user1
    }, {
        uid: uids.task3,
        name: "Task3",
        ImageUid: uids.image1,
        UserUid: uids.user2
    }],

    TaskMetric: [{
        uid: uids.taskMetric1,
        name: "Metric1",
        unit: "Unit1",
        TaskUid: uids.task1
    }, {
        uid: uids.taskMetric2,
        name: "Metric2",
        unit: "Unit2",
        TaskUid: uids.task1
    }, {
        uid: uids.taskMetric3,
        name: "Metric3",
        unit: "Unit3",
        TaskUid: uids.task3
    }],

    TaskItem: [{
        uid: uids.taskItem1,
        name: "Item1",
        desc: "Desc1",
        period: [
            moment().subtract(7, "hours").toISOString(),
            moment().toISOString()
        ],
        TaskUid: uids.task1
    }, {
        uid: uids.taskItem2,
        name: "Item2",
        TaskUid: uids.task1
    }],

    MetricQuantity: [{
        uid: "6cc8aea1-ff01-4a35-be07-db57e76f0f3c",
        TaskItemUid: uids.taskItem1,
        TaskMetricUid: uids.taskMetric1,
        quantity: 1
    }, {
        uid: "87f385f3-0268-47fb-8528-abdef3a21cfa",
        TaskItemUid: uids.taskItem1,
        TaskMetricUid: uids.taskMetric2,
        quantity: 2
    }]

};

export default fixture;
