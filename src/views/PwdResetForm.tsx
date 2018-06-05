import * as React from "react";
import Config from "../Config";

interface IProps {
    title: string;
    token: string;
    error: string;
}

class View extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        const env = Config.env === "production" ? "prod" : "dev";

        return (
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`${Config.assets.externalUrl}/api/v1/assets/css/${env}/PwdResetForm.css`}
                    />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <h1 className={"brand"}>Yokubo</h1>

                    <div className={"card"}>

                        {this.props.error && <h2 className={"errorText"}>{this.props.error}</h2>}
                        <form action="/views/v1/pwd-reset-process" method="post">
                            <input type="password" name="newPwd" placeholder="Enter password" className={"pwdInputText"} />
                            <input type="hidden" name="token" value={this.props.token} />
                            <input type="submit" value="Set password" className={"submitButton"} />
                        </form>

                    </div>
                </body>
            </html>
        );
    }
}

module.exports = View;
