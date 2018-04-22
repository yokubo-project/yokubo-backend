import * as React from "react";

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
                    <link rel="stylesheet" type="text/css" href="http://127.0.0.1:8080/v1/assets/css/PwdResetSuccess.css" />
                    <title>{this.props.title}</title>

                </head>
                <body>
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
