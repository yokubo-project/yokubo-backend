import "../../shared/util/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { migrateUp } from "../../shared/util/umzug";

(async () => {

    log.debug("Migrating");
    await migrateUp(true);
    sequelize.close();

})();
