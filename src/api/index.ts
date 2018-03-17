import "./polyfills";

import sequelize from "../shared/util/sequelize";
import Api from "./Api";

(async () => {
    if (!module.parent) {

        sequelize.addModels([__dirname + "/../shared/models"]);

        const api = new Api();
        api.start();

    }
})();
