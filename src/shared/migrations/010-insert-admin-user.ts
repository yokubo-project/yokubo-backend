import * as bcrypt from "bcrypt";

import Config from "../Config";
import { User } from "../models/User";

module.exports = {
    up: async (queryInterface: any): Promise<void> => {
        await User.create({
            username: Config.admin.username,
            password: await bcrypt.hash(Config.admin.password, Config.auth.bcryptSaltRounds),
            name: Config.admin.name,
            isAdmin: true
        });
    },
    down: async (queryInterface: any): Promise<void> => {
        await User.destroy({ where: { username: Config.admin.username } });
    }
};
