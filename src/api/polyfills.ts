import * as bluebird from "bluebird";
import * as cls from "continuation-local-storage";
import * as Sequelize from "sequelize";
import * as sourceMapSupport from "source-map-support";
import * as uuid from "uuid";

import log from "../shared/util/log";

// initialize source map support for stack traces
sourceMapSupport.install();

// preserve data across async callbacks
const clsNmespace = cls.createNamespace(`CLS_${uuid.v4()}`);
// tslint:disable-next-line:no-unsafe-any
(Sequelize as any).useCLS(clsNmespace);

// tslint:disable-next-line
const clsBluebird = require('cls-bluebird');
clsBluebird(clsNmespace);

global.Promise = bluebird;

// use bluebird with fetch
const fetch: any = require("node-fetch");
fetch.Promise = bluebird;

// make fetch available globally
(global as any).fetch = require("node-fetch");

// tslint:disable-next-line:no-console
log.debug(`Polyfills and utils installed. CLS=${clsNmespace.name}`);
