# yokubo-backend

Nodejs Backend of the [Yokubo App](https://play.google.com/store/apps/details?id=org.yokubo.app), a project tracking tool, and the corresponding [Yokubo Landing Page](https://www.yokubo.org).

## About Yokubo

With Yokubo you can track your projects, record the time you spent on them and make notes about certain metrics defined by yourself. The app automatically calculates valuable statistics and gives you insights on your overall performance.

 ## Requirements

### Dependencies

* [Node](https://nodejs.org) 8
* [Yarn](https://yarnpkg.com) 1.3+
* [PostgreSQL](https://www.postgresql.org/) 9.4+

### Package requirements

* ImageMagick

## Installation & Usage

#### Install node modules

```sh
$ yarn install
```

#### Configure environment

##### Create env folder

In the root directory of your project create an env folder and change into this folder

```sh
$ mkdir env && cd env
```

##### Setup test environment

Create a file named `test.env`

```sh
$ touch test.env
```

Add the following environment  variables to that file

```
NODE_ENV=test

# HAPI server settings
SERVER_HOST=127.0.0.1
SERVER_PORT=8080

# Database settings
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=yokubo-test

# Logger settings
FILE_SEVERITY=error
FILE_PATH=./logs/yokubo-backend.log
CONSOLE_SEVERITY=error
MAIL_RECEIVER=mail@example.com

# Assets
EXTERNAL_ASSETS_URL_HOST=http://127.0.0.1:8080

# Static pages
STATIC_WEBPAGES_URL_HOST=http://127.0.0.1:8080

# Mailing (Sparkpost)
MAIL_API_KEY=<your api key>
MAIL_FROM=mail@example.com

# Tests
# SEND_TEST_MAILS --> set for yarn:test cmd in package.json
TESTUSER_1_EMAIL=mail@example.com
TESTUSER_2_EMAIL=mail@example.com

# Admin user
ADMIN_USERNAME=admin
ADMIN_PWD=whatever
ADMIN_NAME=Administrator

# Legal disclosure
LEGAL_DISCLOSURE_NAME=Your name
LEGAL_DISCLOSURE_ADDRESS=Your addres
LEGAL_DISCLOSURE_PLZ=Your plz
LEGAL_DISCLOSURE_CITY=_Your city
LEGAL_DISCLOSURE_STATE=Your state
LEGAL_DISCLOSURE_EMAIL=mail@example.com
```

##### Setup prod env

Create a file named `prod.env`

```sh
$ touch prod.env
```

Add the following environment  variables to that file

```
NODE_ENV=development

# HAPI server settings 
SERVER_HOST=0.0.0.0
SERVER_PORT=8080

# Database settings
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=yokubo

# Logger settings
FILE_SEVERITY=error
FILE_PATH=./logs/yokubo-backend.log
CONSOLE_SEVERITY=info
MAIL_RECEIVER=mail@example.com

# Assets
EXTERNAL_ASSETS_URL_HOST=http://127.0.0.1:8080

# Static pages
STATIC_WEBPAGES_URL_HOST=http://127.0.0.1:8080

# Mailing (Sparkpost)
MAIL_API_KEY=<your api key>
MAIL_FROM=mail@example.com

# Admin user
ADMIN_USERNAME=admin
ADMIN_PWD=whatever
ADMIN_NAME=Administrator

# Legal disclosure
LEGAL_DISCLOSURE_NAME=Your name
LEGAL_DISCLOSURE_ADDRESS=Your addres
LEGAL_DISCLOSURE_PLZ=Your plz
LEGAL_DISCLOSURE_CITY=_Your city
LEGAL_DISCLOSURE_STATE=Your state
LEGAL_DISCLOSURE_EMAIL=mail@example.com
```

#### Transpile Typescript

```sh
$ yarn build
```

#### Setup database

```sh
$ yarn db:migrate
```

#### Run tests

```sh
$ yarn test
```

#### Start server locally

```sh
$ yarn start
```

## License

```
[MIT](https://choosealicense.com/licenses/mit/)
```

 ## References

[yokubo-app](https://github.com/yokubo-app), the corresponding React-Native app.