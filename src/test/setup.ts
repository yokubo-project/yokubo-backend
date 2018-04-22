import "../shared/util/polyfills";

const chai = require("chai");
const chaiJestSnapshot = require("chai-jest-snapshot");
const chaiHttp = require("chai-http");

import log from "../shared/util/log";
import sequelize from "../shared/util/sequelize";
import { migrateUp } from "../shared/util/umzug";
import { dropTables, bulkImport } from "../shared/util/helpers";
import Server from "../Server";
import fixture from "./fixture";

// Configuring chai plugins
chai.use(chaiHttp);
chai.use(chaiJestSnapshot);

let server: Server;

before(async function () {

    log.debug("Loading sequelize models");
    await sequelize.addModels([__dirname + "/../shared/models"]);

    log.debug("Dropping all tables");
    await dropTables();

    log.debug("Migrating");
    await migrateUp(true);

    log.debug("Importing fixture");
    await bulkImport(fixture);

    log.debug("Starting testserver");

    log.debug("Creating new server");
    server = await new Server();

    log.debug("Starting server");
    await server.start();

});


beforeEach(async function () {

    log.debug("Dropping all tables");
    await dropTables();

    log.debug("Migrating");
    await migrateUp(true);

    log.debug("Loading sequelize models");
    await sequelize.addModels([__dirname + "/../shared/models"]);

    log.debug("Importing fixture");
    await bulkImport(fixture);

});
