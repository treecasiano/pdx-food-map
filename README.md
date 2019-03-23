# DRAFT ---  Node/Express/Vue/Leaflet Boilerplate with a Postgres development database in a Docker container

## Setting up the Development Environment
_Instructions are for Linux/Unix users._

1. Install Docker
2. Start the dev database

Change directories to the `db` folder and use the following commands to make sure you have the right permissions for executing the following scripts. These scripts are used to manage the development database. 

`chmod u+x create.sh`
`chmod u+x restore.sh`
`chmod u+x login.sh`
`chmod u+x dump.sh`

From the `db` folder, run the command `./create.sh` to create the Docker container. 

The image used is called `mdillon/postgis` and includes PostGIS 2.5. (This container is based on the )official Postgres Docker container. For more information: https://hub.docker.com/r/mdillon/postgis.) 

In this project, the container has been named `pgdev` and the local development database within it is called `dev`. 

2. Install Node using nvm and use automated node version management 
2. Run `npm install` from both the project root folder and the `client` folder. 

Note: There are two sets of node_modules and package.json files, so you will need to run Node in two separate terminal windows, one for the client-side code and one for the server-side code. 

## Testing

### Client-side Testing: End-to-End Testing with Cypress

### Server-side Testing: Unit and API Integration Testing with Jest

<!-- TODO: Explain in more detail the purpose of each of the Docker scripts and the dummy data in the dump.sql file. -->
<!-- TODO Get link and instructions for automated node version management. -->
<!-- TODO: Need a hello_map table of dummy point data. -->
<!-- TODO: Create Swagger backend GET request for each dummy table. -->
<!-- TODO: Create a Cypress test for the landing page. -->