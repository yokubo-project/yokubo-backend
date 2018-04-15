import "../../shared/util/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { migrateDown } from "../../shared/util/umzug";

(async () => {

    log.debug("Loading sequelize models");
    await sequelize.addModels([__dirname + "/../../shared/models"]);

    log.debug("Migrating down");
    await migrateDown();
    
    sequelize.close();

})();
