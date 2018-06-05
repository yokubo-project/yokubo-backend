import * as React from "react";
import Config from "../Config";

interface IProps {
    title: string;
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
                        href={`${Config.assets.externalUrl}/api/v1/assets/css/${env}/PwdResetSuccess.css`}
                    />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <h1 className={"brand"}>Yokubo</h1>

                    <div className={"card"}>
                        <h2 className={"successText"}>Your password was set successfully.</h2>
                    </div>

                </body>
            </html>
        );
    }
}

module.exports = View;
