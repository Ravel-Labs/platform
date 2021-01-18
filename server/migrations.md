## Migrations

### Manual Database Setup

#### Prerequisites
- [Install postgres](https://www.postgresql.org/download/)

- Have a user set up using `psql`, if one does not already exits.
`CREATE USER <username> WITH ENCRYPTED PASSWORD <password>`

#### Steps to get setup

1. Run the `psql` command and create the `test` and `development` databases under your preferred db user. 

```
$ psql
psql (version)
Type "help" for help.

<user># CREATE DATABASE ravel;
CREATE DATABASE
<user># CREATE DATABASE ravel_test;
CREATE DATABASE
<user># \q
```
2. Run `knex migrate:latest` to create the tables in your databases.