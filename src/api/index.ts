import "../shared/util/polyfills";

import log from "../shared/util/log";
import sequelize from "../shared/util/sequelize";
import Api from "./Api";

(async () => {
    if (!module.parent) {

        log.debug("Starting ...");

        log.debug("Loading sequelize models");
        sequelize.addModels([__dirname + "/../shared/models"]);

        log.debug("Creating new API serivce");
        const api = new Api();

        log.debug("Starting API service");
        api.start();

    }
})();
