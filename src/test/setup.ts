import "../api/polyfills";

const chai = require("chai");
const chaiJestSnapshot = require("chai-jest-snapshot");
const chaiHttp = require("chai-http");
const requireDir = require("require-dir");

import log from "../shared/util/log";
import sequelize from "../shared/util/sequelize";
import { migrateUp } from "../shared/util/umzug";
import { dropTables, bulkImport } from "../shared/util/helpers";
import Api from "../api/Api";
import fixture from "./fixture";

// Configuring chai plugins
chai.use(chaiHttp);
chai.use(chaiJestSnapshot);

before(async function () {

    log.debug("Dropping all tables");
    await dropTables();

    log.debug("Migrating");
    await migrateUp(true);

    log.debug("Loading sequelize models");
    sequelize.addModels([__dirname + "/../shared/models"]);

    log.debug("Importing fixture");
    await bulkImport(fixture);

    log.debug("Starting testserver");

    log.debug("Creating new API serivce");
    const api = new Api();

    log.debug("Starting API service");
    api.start();

});

// app related tests...
requireDir("./api", {
    recurse: true
});

