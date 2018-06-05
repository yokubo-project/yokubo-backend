// tslint:disable-next-line:no-import-side-effect
import "../../util/polyfills";

import { dropTables } from "../../util/helpers";
import log from "../../util/log";
import sequelize from "../../util/sequelize";

(async () => {

    log.debug("Droping all tables");
    await dropTables();
    sequelize.close();

})();
