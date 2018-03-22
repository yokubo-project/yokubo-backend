// const chai: Chai.ChaiStatic = require("chai");

// import Api from "../api/Api";
// import fixtures, { user1, user2 } from "./fixtures";

// type IAvailableTestUsers = "user1" | "user2";

// export const users = {
//     user1: {
//         uid: user1.uid,
//         refreshToken: user1.RefreshToken.token,
//         accessToken: user1.AccessToken.token
//     },
//     user2: {
//         uid: user2.uid,
//         refreshToken: user2.RefreshToken.token,
//         accessToken: user2.AccessToken.token
//     },
// };

// export interface IRequestOptions {
//     user?: IAvailableTestUsers;
// }

// export interface IUserInfo {
//     id: number;
//     uid: string;
//     refreshToken: string;
//     accessToken: string;
// }

// export interface IResponse<T> extends ChaiHttp.Response {
//     body: T;
// }

// export default class Request {
//     static api: Api = null;
//     static users = users; // reuse the above definition

//     static create(verb: string, path: string, options?: IRequestOptions): ChaiHttp.Request {
//         let request = <ChaiHttp.Request>chai.request(Request.api.server.info.uri)[verb.toLowerCase()](path);
//         if (options && options.user && Request.user(options.user)) {
//             request = request.set("Authorization", "Bearer " + Request.user(options.user).accessToken);
//         }
//         return request;
//     }

//     static user(username: IAvailableTestUsers): IUserInfo {
//         return users[username];
//     }
// }
