const chai = require("chai");
import Config from "./../shared/Config";

export default function chaiRequest(verb: string, path: string, accessToken?: string) {

    const url = `http://${Config.host}:${Config.port}`;
    let request = chai.request(url)[verb.toLowerCase()](path);

    if (accessToken) {
        request = request.set("Authorization", "Bearer " + accessToken);
    }
    
    return request;
}
