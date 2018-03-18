import "../../api/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { migrateUp } from "../../shared/util/umzug";

(async () => {

    log.debug("Migrating up");
    await migrateUp(false);

    log.debug("Explicitly closing sequelize connection");
    sequelize.close();

})();