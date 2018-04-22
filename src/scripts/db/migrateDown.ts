import "../../util/polyfills";

import log from "../../util/log";
import sequelize from "../../util/sequelize";
import { migrateDown } from "../../util/umzug";

(async () => {

    log.debug("Loading sequelize models");
    await sequelize.addModels([__dirname + "/../../models"]);

    log.debug("Migrating down");
    await migrateDown();
    
    sequelize.close();

})();
