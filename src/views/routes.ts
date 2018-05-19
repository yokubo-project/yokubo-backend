import * as Hapi from "hapi";
import Config from "../Config";

export const routes = (<any[]>[]).concat([
    {
        method: "GET",
        path: "/",
        config: { auth: false },
        handler: (request: Hapi.Request, h: any) => {
            return h.view("LandingPage", { title: "Yokubo" });
        }
    },
    {
        method: "GET",
        path: "/views/v1/pwd-reset-form/{token}",
        config: { auth: false },
        handler: (request: Hapi.Request, h: any) => {
            return h.view("PwdResetForm", { title: "PwdReset", token: request.params.token });
        }
    },
    {
        method: "POST",
        path: "/views/v1/pwd-reset-process",
        config: { auth: false },
        handler: async (request: Hapi.Request, h: any) => {
            const { token, newPwd } = request.payload as any;

            // Make local request to the api
            const res = await fetch(`http://127.0.0.1:${Config.port}/api/v1/auth/setforgottenpwd`, {
                method: "POST",
                body: JSON.stringify({ token, newPwd })
            });
            const resJson = await res.json();

            if (res.status === 400 && resJson.message === "PasswordWeak") {
                return h.view("PwdResetForm", { title: "PwdReset", token: request.params.token, error: "Password to weak. Please choose a stronger one." });
            } else if (res.status === 404) {
                return h.view("PwdResetForm", { title: "PwdReset", token: request.params.token, error: "Invalid Request. Either the user does not exist or the email link is not valid anymore." });
            } else if (res.status !== 200) {
                return h.view("PwdResetForm", { title: "PwdReset", token: request.params.token, error: "Sorry, an unknown error occured. Our team got notified and will fix this soon. Please try again later." });
            }

            return h.view("PwdResetSuccess", { title: "PwdReset", token: request.params.token });
        }
    },
    {
        method: "GET",
        path: "/views/v1/privacy",
        config: { auth: false },
        handler: (request: Hapi.Request, h: any) => {
            return h.view("Privacy", { title: "Yokubo - Privacy" });
        }
    },
    {
        method: "GET",
        path: "/views/v1/imprint",
        config: { auth: false },
        handler: (request: Hapi.Request, h: any) => {
            return h.view("Imprint", { title: "Yokubo - Impress" });
        }
    },
]);
