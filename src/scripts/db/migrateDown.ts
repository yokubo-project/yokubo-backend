import "../shared/util/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { migrateDown } from "../../shared/util/umzug";

(async () => {

    log.debug("Migrating down");
    await migrateDown();
    sequelize.close();

})();
