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
                        href={`${Config.assets.externalUrl}/api/v1/assets/css/${env}/Privacy.css`}
                    />
                    <title>{this.props.title}</title>
                </head>
                <body className={"background"}>
                    <div className={"brandContainer"}>
                        <a href="/">
                            <img
                                className={"brand"}
                                src={`${Config.assets.externalUrl}/api/v1/assets/yokubo_logo.png`}
                                alt="yokubo_logo.png"
                            />
                        </a>
                    </div>

                    <div className={"card"}>
                        <h1>Privacy</h1>
                        <h2 className={"subheader"}>Policy</h2>
                        <p className={"text"}>
                            By using our app or accessing our services in some other way
                            you accept the terms and conditions of this Privacy Policy and the
                            processing of your personal data.
                        </p>
                        <h2 className={"subheader"}>Data we collect</h2>
                        <p className={"text"}>
                            In order to provide our services we may collect the following data:
                            <ul>
                                <li>
                                    <p className={"text"}>email address</p>
                                </li>
                                <li>
                                    <p className={"text"}>full name</p>
                                </li>
                                <li>
                                    <p className={"text"}>
                                        projects related data: project name, project image, metrics, task name,
                                        task description, task start-date and end-date, metric quanitites.
                                    </p>
                                </li>
                            </ul>
                        </p>
                        <h2 className={"subheader"}>Use of data</h2>
                        <p className={"text"}>
                            We may employ third party companies and individuals to facilitate our Service,
                            to provide the Service on our behalf, to perform Service-related services and/or
                            to assist us in analyzing how our Service is used. These third parties have
                            access to your Personal Information only to perform specific tasks on our behalf
                            and are obligated not to disclose or use your information for any other purpose.
                        </p>
                        <h2 className={"subheader"}>Security of data</h2>
                        <p className={"text"}>
                            In order to ensure the security and integrity of your personal data and to prevent any
                            unauthorized access we use generally accepted industry standards, technologies and
                            procedures (such as firewalls, security software, encrypted transmission, etc.).
                            Unfortunately, despite our efforts, no system can be 100% bulletproof and there is always
                            a risk of unauthorized access to your personal data. By using our app and services
                            you assume this risk.
                        </p>
                        <h2 className={"subheader"}>Deleting your data</h2>
                        <p className={"text"}>
                            Our app offers the possibility to delete your account. When doing so all your
                            personal data gets deleted from our servers. Please note that this process is
                            therefore irreversible and your data cannot be restored.
                        </p>
                        <h2 className={"subheader"}>Children policy</h2>
                        <p className={"text"}>
                            Our services are not directed at persons under the age of 13 and we do not knowingly
                            collect any data from persons under the age of 13. If you are under the age of 13, please
                            do not submit any personal data via the services we provide unless your activity is
                            monitored by your parents or legal guardians and that they gave you their permission.
                        </p>
                        <h2 className={"subheader"}>Changes to this policy</h2>
                        <p className={"text"}>
                            We reserve the right to change our Privacy Policy without prior notice. This is most likely
                            the case when new features are implemented or existing features are updated or removed.
                            Our most up-to-date Privacy Policy will be available here.
                        </p>
                        <h2 className={"subheader"}>More information</h2>
                        <p className={"text"}>
                            Please feel free to contact us at mail@yokubo.org in case you have further questions or
                            concerns about your personal data.
                        </p>
                        <h2 className={"subheader"}>Last update</h2>
                        <p className={"text"}>
                            2018-06-03
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
