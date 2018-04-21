import * as React from "react";

interface IProps {
    title: string;
    token: string;
    error: string;
}

const styles = {
    card: {
        margin: "auto",
        width: "50%",
        border: "3px solid green",
        padding: 10
    }
};

class View extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
    }

    render() {

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <h1>Yokubo</h1>
                    <div style={styles.card}>

                        {this.props.error && <h1>{this.props.error}</h1>}
                        <form action="/views/v1/pwd-reset-process" method="post">
                            <span>New Password:</span>
                            <br />
                            <input type="password" name="newPwd" />
                            <br />
                            <br />
                            <input type="hidden" name="token" value={this.props.token} />
                            <input type="submit" value="Submit" />
                        </form>

                    </div>
                </body>
            </html>
        );
    }
}

module.exports = View;
