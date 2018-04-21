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
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <h1>Passwort reset erfolgreich.</h1>
                </body>
            </html>
        );
    }
}

module.exports = View;
