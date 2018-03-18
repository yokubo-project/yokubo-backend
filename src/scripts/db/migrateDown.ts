import "../../api/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { migrateDown } from "../../shared/util/umzug";

(async () => {

    log.debug("Migrating down");
    await migrateDown();

    log.debug("Explicitly closing sequelize connection");
    sequelize.close();

})();
