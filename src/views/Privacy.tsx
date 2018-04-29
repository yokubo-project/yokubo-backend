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
                    <link rel="stylesheet" type="text/css" href={`${Config.assets.externalUrl}/api/v1/assets/css/Privacy.css`} />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <div className={"card"}>
                        <h2 className={"subheader"}>Privacy Policy</h2>
                        <p className={"text"}>asdfasdf</p>
                    </div>

                </body>
            </html>
        );
    }
}

module.exports = View;
