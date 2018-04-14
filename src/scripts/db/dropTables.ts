import "../../shared/util/polyfills";

import log from "../../shared/util/log";
import sequelize from "../../shared/util/sequelize";
import { dropTables } from "../../shared/util/helpers";

(async () => {

    log.debug("Droping all tables");
    await dropTables();
    sequelize.close();

})();
