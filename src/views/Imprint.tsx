import * as React from "react";
import Config from "../Config";

interface IProps {
    title: string;
}

class View extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="stylesheet" type="text/css" href={`${Config.assets.externalUrl}/api/v1/assets/css/${Config.env === "production" ? "prod" : "dev"}/Imprint.css`} />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <div className={"brandContainer"}>
                        <a href="/">
                            <img className={"brand"} src={`${Config.assets.externalUrl}/api/v1/assets/yokubo_logo.png`} />
                        </a>
                    </div>

                    <div className={"card"}>
                        <h1>Imprint</h1>
                        <h2 className={"subheader"}>We are currently working on it...</h2>
                        <p className={"text"}>It will be available soon!</p>
                    </div>

                    <div className={"footer"}>
                        <div className={"copyright"}>© 2018 <a className={"link"} href="/">Yokubo</a></div>
                        <div className={"link-section"}>
                            <a className={"link"} href="/views/v1/privacy">Privacy</a>
                            <a className={"link"} href="/views/v1/imprint">Imprint</a>
                            <a className={"link-desktop"} href="https://github.com/yokubo-app">Github</a>
                        </div>
                    </div>

                </body>
            </html>
        );
    }
}

module.exports = View;
