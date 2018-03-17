import "../../api/polyfills";
import sequelize from "../../shared/util/sequelize";
import { migrateUp } from "../../shared/util/umzug";

migrateUp(false).then(() => {
    sequelize.close();
});
