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
                        <h2 className={"subheader"}>Legal disclosure</h2>
                        <p className={"text"}>
                            {Config.legalDisclosure.name}<br />
                            {Config.legalDisclosure.address}<br />
                            {Config.legalDisclosure.plz}, {Config.legalDisclosure.city}<br />
                            {Config.legalDisclosure.state}<br />
                            {Config.legalDisclosure.email}<br />
                        </p>
                        <h2 className={"subheader"}>Accountability for content</h2>
                        <p className={"text"}>
                            The contents of our pages have been created with the utmost care. However, we cannot
                            guarantee the contents' accuracy, completeness or topicality. According to statutory
                            provisions, we are furthermore responsible for our own content on these web pages.
                            In this context, please note that we are accordingly not obliged to monitor merely
                            the transmitted or saved information of third parties, or investigate circumstances
                            pointing to illegal activity.
                        </p>
                        <h2 className={"subheader"}>Accountability for links</h2>
                        <p className={"text"}>
                            Responsibility for the content of external links (to web pages of third parties) lies
                            solely with the operators of the linked pages. No violations were evident to us at
                            the time of linking. Should any legal infringement become known to us, we will remove
                            the respective link immediately.
                        </p>
                        <h2 className={"subheader"}>Copyright and trademark laws</h2>
                        <p className={"text"}>
                            In all our publications, we endeavor to respect the copyright of the images, graphics,
                            sound documents, video sequences and texts used, to use images, graphics, sound documents,
                            video sequences and texts created by ourselves or resort to using royality-free images,
                            graphics, sound documents, video sequences and texts. All brand names and trademarks
                            mentioned on the website and, where applicable, protected by third parties are subject
                            without restriction to the provisions of the applicable transmark law and the ownership
                            rights of the respective registered owners. A mere mention should not lead to the conclusion
                            that trademarks are not protected by rights of third parties! The copyright for objects,
                            created and published by us, remains with us. Reproduction or use of such images, graphics,
                            sound documents, video sequences and texts in other electronic or printed publications is
                            not permitted without express consent of the author.
                        </p>
                        <h2 className={"subheader"}>Content rights</h2>
                        <p className={"text"}>
                            All rights reserved. Any duplication or distribution of the whole content
                            or parts of it in any media is subject to consent of the publisher.
                        </p>
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
