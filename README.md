# PDX Food Environment Map

## Data

## Tech Stack

Node/Express
Vue.js
Leaflet
Postgres database in a Docker container

## Setting up the Development Environment

_Instructions are for Linux/Unix users._

### 1. Install Node with NVM

- After Node installation, run `npm install` from both the project root folder and the `client` folder.
- There are two sets of node_modules and package.json files, so you will need to run Node in two separate terminal windows, one for the client-side code and one for the server-side code.

#### Automated Node Version Management

`.nvmrc` If you have automated Node version managemetn set up with NVM, the `.nvmrc` file will be read when you `cd` into the directory and your Node version will change automagically.

### 3. Docker and Database Setup

#### Install Docker

#### Database Management Scripts

Change directories to the `db` folder and use the following commands to make sure you have the right permissions for executing the following scripts. These scripts are used to manage the development database.

`chmod u+x create.sh`

`chmod u+x restore.sh`

`chmod u+x login.sh`

`chmod u+x dump.sh`

From the `db` folder, run the command `./create.sh` to create the Docker container.

Restore the database from a dumpfile by running `./restore.sh`

The image used is called `mdillon/postgis` and includes PostGIS 2.5. (This container is based on the )official Postgres Docker container. For more information: https://hub.docker.com/r/mdillon/postgis.)

In this project, the container has been named `pgdev` and the local development database within it is called `dev`.

#### Start the dev database

## Testing

### Client-side Testing: End-to-End Testing with Cypress

### Server-side Testing: Unit and API Integration Testing with Jest
