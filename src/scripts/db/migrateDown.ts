import "../../api/polyfills";
import sequelize from "../../shared/util/sequelize";
import { migrateDown } from "../../shared/util/umzug";

migrateDown().then(() => {
    sequelize.close();
});
