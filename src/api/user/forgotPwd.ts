import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";
import * as moment from "moment";

import Config from "../../Config";
import { User } from "../../models/User";
import { preventTimingAttack } from "../../util/helpers";
import { PwdResetToken } from "../../models/PwdResetToken";
import log from "../../util/log";
import { sendMail } from "../../util/mail";

export const forgotPwd = [{
    method: "POST",
    path: "/api/v1/auth/forgotpwd",
    handler: forgotPwdHandler,
    config: {
        auth: false,
        description: "Get email with a PasswordResetToken",
        tags: ["api", "post", "v1", "auth", "forgotpwd"],
        validate: {
            options: {
                abortEarly: false
            },
            payload: Joi.object().required().keys({
                username: Joi.string().trim().email().required()
            })
        },
        response: {
            schema: Joi.object().required().keys({
                validUntil: Joi.date().required()
            })
        },
    }
}];

async function forgotPwdHandler(request: Hapi.Request, reply: Hapi.ResponseToolkit): Promise<any> {

    const { username } = request.payload as any;
    const user = await User.find({ where: { username } });

    // Return if user does not exist --> do not throw error in order to prevent exploiting registered users
    if (!user) {
        await preventTimingAttack();
        return {
            validUntil: moment().add(Config.auth.tokenExpiresIn, "milliseconds").toDate()
        };
    }

    // Try to return already existing PwdResetToken
    const pwdResetToken = await PwdResetToken.findOne({
        where: {
            UserUid: user.uid,
            validUntil: {
                $gt: moment().subtract(Config.auth.tokenExpiresIn, "milliseconds").toDate()
            }
        }
    });

    if (pwdResetToken) {
        await preventTimingAttack();
        return pwdResetToken.publicJsonObject();
    }

    // Create new PwdResetToken
    const newPwdResetToken = await PwdResetToken.create({
        UserUid: user.uid,
        validUntil: moment().add(Config.auth.tokenExpiresIn, "milliseconds").toDate()
    });

    // Send mail
    try {
        const subject = "Reset Password";
        const html = `<html><body><p>Click the following link to reset your password: ${Config.pages.forgotPwdLink}${newPwdResetToken.token}</p></body></html>`;
        const recipients = [{ address: user.username }];
        await sendMail(subject, html, recipients);
    } catch (err) {
        log.error(`Unable to send PwdReset mail to recipient ${user.username}`);
        Boom.badData(`Unable to send PwdReset mail to recipient ${user.username}`);
    }

    return newPwdResetToken.publicJsonObject();

}
