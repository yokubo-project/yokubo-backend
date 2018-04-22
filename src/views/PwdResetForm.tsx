import * as React from "react";
import "./PwdResetForm";

interface IProps {
    title: string;
    token: string;
    error: string;
}

class View extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {

        return (
            <html className={"background"}>
                <head>
                    <link rel="stylesheet" type="text/css" href="http://127.0.0.1:8080/api/v1/assets/css/PwdResetForm.css" />
                    <title>{this.props.title}</title>

                </head>
                <body>
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
