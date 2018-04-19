import * as Hapi from "hapi";

export const routes = (<any[]>[]).concat([
    {
        method: "GET",
        path: "/",
        config: {
            auth: false,
        },
        handler: (request: Hapi.Request, h: any) => {

            return h.view("LandingPage", { title: "Yokubo" });
        }

    }
]);
