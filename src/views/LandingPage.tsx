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
            <html className={"background"}>
                <head>
                    <link rel="stylesheet" type="text/css" href={`${Config.assets.externalUrl}/api/v1/assets/css/LandingPage.css`} />
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <h1 className={"brand"}>Yokubo</h1>

                    <div className={"maincontainer"}>

                        <div className={"subcontainer"}>
                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Placeholder 1</h2>
                            </div>

                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Placeholder 2.</h2>
                            </div>

                            <div className={"card"}>
                                <h2 className={"text"}>&#8226; Placeholder 3.</h2>
                            </div>
                        </div>

                        <div className={"subcontainer"}>
                            <div className={"android-main-menu"}>
                            </div>
                        </div>

                    </div>

                    <div className={"footer"}>
                        <p className={"mail-contact"}>
                            <strong>Contact: </strong>
                            <a className={"link"} href="mailto:mail@yokubo.org">mail@yokubo.org</a>
                        </p>
                        <div className={"links-section"}>
                            <a className={"link"} href="privacy">Privacy</a>
                            <a className={"link"} href="about">About</a>
                            <a className={"link"} href="about">Github</a>
                        </div>
                        <div className={"copyright"}>© 2018 Yokubo</div>
                    </div>

                </body>
            </html>
        );
    }
}

module.exports = View;
