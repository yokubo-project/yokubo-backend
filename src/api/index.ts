import "./polyfills";

import Api from "./Api";

if (!module.parent) {
    const api = new Api();
    api.start();
}
