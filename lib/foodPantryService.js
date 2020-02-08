let table = "food_pantry";

const pgp = require("pg-promise");

class ST_GeomFromText {
  // The ST_GeomFromText class sanitizes the SQL inputs from the client and returns a raw, but safe, pre-formatted SQL.
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rawType = true;
  }

  toPostgres(self) {
    return pgp.as.format("ST_GeomFromText('POINT($1 $2)', 4326)", [
      this.x,
      this.y
    ]);
  }
}

function factory({ pg }) {
  return {
    create,
    get,
    getGeoJSON,
    list,
    remove,
    update,
    search
  };

  async function create(insertParams) {
    // TODO: Add longitude and latitude to the table and route and refactor to eliminate the processing of the geom values from the client
    // and remove the geom field from the API.
    const longLatArray = insertParams.geom.split(" ");
    const long = parseInt(longLatArray[0]);
    const lat = parseInt(longLatArray[1]);
    // Remove geom property from the insertParams because it is not part of the parameterized array (dollarVals).
    delete insertParams.geom;

    const insertKeys = Object.keys(insertParams);
    const insertValues = Object.values(insertParams);

    // Create the array of parameters to be used for the values to make sure SQL strings are escaped on the PostgreSQL server.
    const dollarVals = insertKeys.map((k, index) => {
      return `$${index + 1}`;
    });

    const params = insertValues;

    const query = `INSERT INTO ${table}(geom, ${insertKeys}) VALUES (${new ST_GeomFromText(
      long,
      lat
    ).toPostgres()}, ${dollarVals}) RETURNING gid`;

    const result = await pg.query(query, params);
    return result[0];
  }

  async function get(id) {
    // prettier-ignore
    const query =
`SELECT
  gid,
  location_name,
  street_address_1, 
  street_address_2, 
  city, 
  state, 
  zip, 
  hours_of_operation, 
  website, 
  phone,
  ST_X(geom) as longitude, 
  ST_Y(geom) as latitude
FROM ${table}
WHERE
  gid = $1`;

    const result = await pg.query(query, [id]);
    return result[0];
  }

  async function getGeoJSON() {
    // prettier-ignore
    const query = `SELECT jsonb_build_object(
    'type',     'FeatureCollection',
    'features', jsonb_agg(feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'id',         gid,
    'geometry',   ST_AsGeoJSON(geom)::jsonb,
    'properties', to_jsonb(row) - 'gid' - 'geom'
  ) AS feature
  FROM (SELECT * FROM ${table}) row) features;
    `;
    const result = await pg.query(query);
    return result[0]["jsonb_build_object"];
  }

  async function list() {
    // prettier-ignore
    const query =
`SELECT
  gid,
  location_name,
  street_address_1, 
  street_address_2, 
  city, 
  state, 
  zip, 
  hours_of_operation, 
  website, 
  phone, 
  ST_X(geom) as longitude, 
  ST_Y(geom) as latitude
FROM ${table}
  `;

    const result = await pg.query(query);
    return result;
  }

  async function remove(id) {
    // prettier-ignore
    const query =
`DELETE FROM ${table} WHERE gid = $1 RETURNING *`;

    const result = await pg.query(query, [id]);
    return result;
  }

  async function update(id, updates) {
    if (typeof id !== "number") {
      throw new Error("id must be a number");
    }

    const longLatArray = insertParams.geom.split(" ");
    const long = parseInt(longLatArray[0]);
    const lat = parseInt(longLatArray[1]);

    let geomVal;
    if (updates.geom) {
      // Remove geom from the parameterized array due to handling of the custom formatting of the Post GIS function ST_GeomFromText.
      geomVal = true;
      delete updates.geom;
    }

    const updateKeys = Object.keys(updates);
    const updateValues = Object.values(updates);

    // Create the array of dollar sign values for the parameterized query, starting with $2 because $1 will be the record id.
    const parameterizedValues = updateKeys.map((k, index) => {
      return `${k} = $${index + 2}`;
    });
    const joinedDollarVals = parameterizedValues.join(", ");

    const queryText = `UPDATE ${table} SET ${joinedDollarVals} `;

    let query;
    // Insert the Post GIS function ST_GeomFromText into the query. This makes sure the strings from the client (lat, long) are properly escaped.
    if (geomVal) {
      query = `${queryText}, geom = ${new ST_GeomFromText(
        long,
        lat
      ).toPostgres()} WHERE gid = $1`;
    } else {
      query = `${queryText} WHERE gid = $1`;
    }
    // The array of params should start with id, passed into this method from route params
    //  because id = $1 in the parameterized array.
    const params = [id].concat(updateValues);
    const result = await pg.query(query, params);
    return result;
  }

  async function search(searchParams) {
    // Search for all points with a distance from a central point (geom).
    const { geom } = searchParams;
    const { distance } = searchParams;
    const query = `SELECT gid, 
    location_name, 
    street_address_1, 
    street_address_2, 
    city, 
    state, 
    zip, 
    hours_of_operation, 
    website, 
    phone, 
    ST_Distance(geom, ref_geom) AS distance,
    ST_X(geom) as longitude, 
    ST_Y(geom) as latitude
FROM ${table}
CROSS JOIN (SELECT ST_MakePoint(${geom})::geography AS ref_geom) AS r
WHERE ST_DWithin(geom, ref_geom, ${distance})
ORDER BY ST_Distance(geom, ref_geom);  `;
    const result = await pg.query(query);
    return result;
  }
}

module.exports = factory;