import * as React from "react";
import Config from "../Config";

interface IProps {
    title: string;
}

class View extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    // tslint:disable-next-line:max-func-body-length
    public render() {
        const env = Config.env === "production" ? "prod" : "dev";

        return (
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link
                        rel="stylesheet"
                        type="text/css"
                        href={`${Config.assets.externalUrl}/api/v1/assets/css/${env}/LandingPage.css`}
                    />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <img
                        className={"brand"}
                        src={`${Config.assets.externalUrl}/api/v1/assets/yokubo_logo.png`}
                        alt="yokubo_logo.png"
                    />

                    <div className={"maincontainer"}>

                        <div className={"subcontainer"}>
                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Track your projects</h2>
                            </div>

                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Get insights and stats</h2>
                            </div>

                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Be more productive</h2>
                            </div>

                            <div className={"download-section"}>
                                <img
                                    className={"download"}
                                    src={`${Config.assets.externalUrl}/api/v1/assets/download_android.svg`}
                                    width="200px"
                                    alt="download_android.svg"
                                />
                            </div>
                        </div>

                        <div className={"subcontainer"}>
                            <div className={"android-main-menu"} />
                        </div>

                    </div>

                    <div className={"footer"}>
                        <div className={"copyright"}>© 2018 Yokubo</div>
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
