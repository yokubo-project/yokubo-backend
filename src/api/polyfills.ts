import * as bluebird from "bluebird";
import * as cls from "continuation-local-storage";
import * as Sequelize from "sequelize";
import * as sourceMapSupport from "source-map-support";
import * as uuid from "uuid";

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

// tslint:disable-next-line:no-console
console.log(`Polyfills and utils installed. CLS=${clsNmespace.name}`);
