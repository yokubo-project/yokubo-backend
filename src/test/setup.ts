// tslint:disable-next-line:no-import-side-effect
import "../util/polyfills";

const chai = require("chai");
const chaiJestSnapshot = require("chai-jest-snapshot");
const chaiHttp = require("chai-http");

import Server from "../Server";
import { bulkImport, dropTables } from "../util/helpers";
import log from "../util/log";
import { migrateUp } from "../util/umzug";
import fixture from "./fixture";

// Configuring chai plugins
chai.use(chaiHttp);
chai.use(chaiJestSnapshot);

let server: Server;

before(async () => {

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

beforeEach(async () => {

    log.debug("Dropping all tables");
    await dropTables();

    log.debug("Migrating");
    await migrateUp(true);

    log.debug("Importing fixture");
    await bulkImport(fixture);

});
