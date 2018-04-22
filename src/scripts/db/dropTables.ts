import "../../util/polyfills";

import log from "../../util/log";
import sequelize from "../../util/sequelize";
import { dropTables } from "../../util/helpers";

(async () => {

    log.debug("Droping all tables");
    await dropTables();
    sequelize.close();

})();
