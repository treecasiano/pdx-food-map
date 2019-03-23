# DRAFT ---  Node/Express/Vue/Leaflet Boilerplate with a Postgres development database in a Docker container

## Setting up the Development Environment
_Instructions are for Linux/Unix users._

1. Install Docker
2. Install Node using nvm and use automated node version management 
2. Run `npm install` from both the project root folder and the `client` folder. 

Note: There are two sets of node_modules and package.json files, so you will need to run Node in two separate terminal windows, one for the client-side code and one for the server-side code. 

4. Change directories to the `db` folder and use the following commands so that you may use the following scripts managing the development database:
`chmod u+x create.sh`
`chmod u+x restore.sh`
`chmod u+x login.sh`
`chmod u+x dump.sh`

## Testing

### Client-side Testing: End-to-End Testing with Cypress

### Server-side Testing: Unit and API Integration Testing with Jest


<!-- TODO: Enable POST GIS extension -->
<!-- TODO: Explain the purpose of each of the Docker scripts and the dummy data in the dump.sql file. -->
<!-- TODO Get link and instructions for automated node version management. -->
<!-- TODO: Need a hello_map table of dummy point data. -->
<!-- TODO: Create Swagger backend GET request for each dummy table. -->
<!-- TODO: Create a Cypress test for the landing page. -->