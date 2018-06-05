// tslint:disable-next-line:no-import-side-effect
import "../../util/polyfills";

import log from "../../util/log";
import sequelize from "../../util/sequelize";
import { migrateUp } from "../../util/umzug";

(async () => {

    log.debug("Loading sequelize models");
    await sequelize.addModels([`${__dirname}/../../models`]);

    log.debug("Migrating");
    await migrateUp(true);

    sequelize.close();

})();
