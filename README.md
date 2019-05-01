# PDX Food Environment Map

The PDX Food Environment Map is an evolving project first launched to satisfy final project requirements for GEOG 576 Geospatial Web and Mobile Programming, a course in the University of Wisconsin's MS in Cartography and GIS Development program.

The map facilitates discovery of sources of fresh produce in the <a href="https://en.wikipedia.org/wiki/Portland_metropolitan_area">Portland Metropolitan Statistical Area (MSA)</a>. It also provides food environment information at the census tract level, surfacing attributes such as food desert classification, poverty rate, vehicle access, and median household income from the USDA Food Access Research Atlas. 

## Data Sources

### Food Access Research Atlas
https://www.ers.usda.gov/data-products/food-access-research-atlas/

Attributes from the USDA's Food Access Research Atlas dataset was joined to census tracts in the Portland-Vancouver-Hillsbor, OR-WA Metropolitan Statistical Area.

### Grocery Store Data
https://gis-pdx.opendata.arcgis.com/datasets/grocery-stores/data

105 grocery stores in the City of Portland are part of the original dataset. Data was gathered for the rest of the metro area, adding another 162 records.

### Farmers Market Data
https://gis-pdx.opendata.arcgis.com/datasets/farmers-markets

Farmers Market locations were obtained from the City of Portland to which have been added additional records to cover the study area. 


## Setting up the Development Environment

_Instructions are for Linux/Unix users._


### 1. Set up the config folder

Before you install node modules or try to run the application, you will need to create a config folder. The `config` folder is not kept in version control. It's a place to store API keys or other secrets. 

From the root of the project, create a folder called `config`:
``` bash
mkdir config
```
```
cd config
```
Create a file in `config` for storing postgres configuration values.  

```
touch default.json
```

Add the following code to `default.json`. These values are for the local development database. 

``` javascript
{
    "pg": {
    "database": "dev",
    "host": "localhost",
    "user": "postgres",
    "password": "docker",
    "port": 5433
    }
}
```

### 2. Install Node with NVM
- If you have not done so already, install Node. The best way I've found is to use the Node Version Manager. See instructions at https://github.com/nvm-sh/nvm. 
- After Node installation, run `npm install` from both the project root folder and the `client` folder.
- There are two sets of node_modules and package.json files, one in the project root and another in the `client` folder. so you will need to run Node in two separate terminal windows, one for the client-side code and one for the server-side code.
- Install the global nodemon package:
``` 
npm install -g nodemon
```
- Run the backend web server:
``` 
nodemon app.js
```

- Run the front-end server from the `client` folder:
```
npm run serve
```

#### Automated Node Version Management

`.nvmrc` If you have automated Node version managemetn set up with NVM, the `.nvmrc` file will be read when you `cd` into the directory and your Node version will change automagically.

### 3. Docker and Database Setup

#### Install Docker.
https://docs.docker.com/install/

#### Create a custom Docker network.

```
docker network create pg
```

#### Database Management Scripts

Change directories to the `db` folder and use the following commands to make sure you have the right permissions for executing the following scripts. These scripts are used to manage the development database.

`chmod u+x create.sh`

`chmod u+x restore.sh`

`chmod u+x login.sh`

`chmod u+x dump.sh`

From the `db` folder, run the command `./create.sh` to create the Docker container.

Restore the database from a dumpfile by running `./restore.sh`.

The image used is called `mdillon/postgis` and includes PostGIS 2.5. (This container is based on the )official Postgres Docker container. For more information: https://hub.docker.com/r/mdillon/postgis.)

In this project, the container has been named `pdxfood` and the local development database within it is called `dev`.

#### Run pgAdmin in another Docker container.

```
docker run -d -p 5050:5050 --name pgadmin --network=pg thajeztah/pgadmin4
```

For more details about this pgAdmin instance: 
https://hub.docker.com/r/thajeztah/pgadmin4 

Visit http://[your-docker-host]:5050

When creating a server in pgAdmin to connect to `pdxfood`, use the defaults for the user and maintenance database. 

The password is `docker` and the host name is the IP address of the Docker container with the PostgreSQL instance. This IP address can be found by using the following Docker command and looking for the property “IPAddress” after running this command:

```
docker inspect pdxfood
```

## 4. Testing

### Server-side Testing: API Integration Testing with Jest
`npm run integration`

### Client-side Testing: End-to-End Testing with Cypress
`npm run cypress`

OR

`npm run cypress:headless`

Cypress was installed in the server-side code so that server-side database utilities that tear down and reseed the database can be used by both the back-end and front-end test frameworks. (These utilities have not yet been built.)
