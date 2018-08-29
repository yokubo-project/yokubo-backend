// tslint:disable-next-line:no-import-side-effect
import "./util/polyfills";

import Server from "./Server";
import log from "./util/log";

(async () => {
    if (!module.parent) {
        log.debug("Starting ...");

        log.debug("Creating new server");
        const server = new Server();

        log.debug("Starting server");
        server.start();
    }
})();
