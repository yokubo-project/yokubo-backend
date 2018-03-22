import * as moment from "moment";

const nextYear = moment().add(1, "years").toDate();

export const uids = {

    user1: "12ab55e3-1418-418b-abbf-35d8cc68d477",
    user2: "368d83d6-d367-4dc4-a6a2-a6cc167604f4",

    accessToken1: "57e97a9a-0928-11e5-9ca6-6c4008ac6d80",
    accessToken2: "de2393f0-0e8e-11e5-8a53-6c4008ac6d80",

    refreshToken1: "d82daf43-75f2-4564-9812-015c60ed4982",
    refreshToken2: "e75078ea-7b34-4a4e-815c-e2f809d55caa"

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
    }]

};

export default fixture;
