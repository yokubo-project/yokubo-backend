# needs to be sourced (`source test.sh`)
export NODE_ENV=test

# HAPI server settings
export SERVER_HOST=127.0.0.1
export SERVER_PORT=8080

# Database settings
export PGHOST=127.0.0.1
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=password
export PGDATABASE=yokubo-test

# Logger settings
export FILE_SEVERITY=error
export FILE_PATH=./logs/yokubo-backend.log
export CONSOLE_SEVERITY=debug