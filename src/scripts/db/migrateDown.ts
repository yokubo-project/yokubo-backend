// tslint:disable-next-line:no-import-side-effect
import "../../util/polyfills";

import log from "../../util/log";
import sequelize from "../../util/sequelize";
import { migrateDown } from "../../util/umzug";

(async () => {
    log.debug("Migrating down");
    await migrateDown();

    sequelize.close();
})();
