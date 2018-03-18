import * as Boom from "boom";
import * as Hapi from "hapi";
import * as zxcvbn from "zxcvbn";
import * as moment from "moment";

import Config from "../../../shared/Config";
import sequelize, { Transaction } from "../../../shared/util/sequelize";
import { User } from "../../../shared/models/User";
import { AppUserProfile } from "../../../shared/models/AppUserProfile";
import { AccessToken } from "../../../shared/models/AccessToken";
import { RefreshToken } from "../../../shared/models/RefreshToken";

export async function register(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { username, password, name } = request.payload as any;

    // Error out if user already exists
    if (await User.find({ where: { username } })) {
        throw Boom.badRequest("User already exists");
    }

    // Error out if password is to weak
    const zxcvbnInfo = zxcvbn(password);
    if (zxcvbnInfo.score < Config.auth.zxcvbnScore) {
        throw Boom.badRequest("Password is to weak", {
            warning: zxcvbnInfo.feedback.warning,
            score: zxcvbnInfo.score
        });
    }

    // Create user within transaction
    return sequelize.transaction(async (transaction: Transaction) => {

        // Create user
        const user = await User.create({
            username,
            password: await User.hashPassword(password)
        });

        // Create app user profile and tokens
        const [, refreshToken, accessToken] = await Promise.all([
            await user.$create("AppUserProfile", { name }) as AppUserProfile,
            await user.$create("RefreshToken", {}) as RefreshToken,
            await user.$create("AccessToken", {
                validUntil: moment().add(Config.auth.tokenExpiresIn, "milliseconds").toDate()
            }) as AccessToken
        ]);

        return {
            tokenType: "Bearer",
            refreshToken: refreshToken.token,
            accessToken: accessToken.token,
            expiresIn: Config.auth.tokenExpiresIn
        };

    });

}
