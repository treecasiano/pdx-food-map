let table = "food_pantry";

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
    // Remove geom property from the insertParams. It is added without using JS template literals
    // to handle the case where using the Post GIS function ST_GeomFromText in the params
    // to update the POINT lat/lng creates a parsing error in the parameterized query.
    // The geom value is required for the creation of a new point feature.
    const geomVal = `ST_GeomFromText('${insertParams.geom}', 4326)`;
    delete insertParams.geom;

    const insertKeys = Object.keys(insertParams);
    const insertValues = Object.values(insertParams);

    // Create the array of parameters to be used for the values to make sure SQL strings are escaped on the PostgreSQL server.
    const dollarVals = insertKeys.map((k, index) => {
      return `$${index + 1}`;
    });

    const params = insertValues;

    const query = `INSERT INTO ${table}(geom, ${insertKeys}) VALUES (${geomVal}, ${dollarVals}) RETURNING gid`;

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
    // TODO: Create helper function for creating parameterized queries (necessary for escaping SQL strings on the PostgreSQL server).
    if (typeof id !== "number") {
      throw new Error("id must be a number");
    }

    let geomVal;
    if (updates.geom) {
      geomVal = `ST_GeomFromText('${updates.geom}', 4326)`;
      // Remove geom from the parameterized array due to SQL parsing error.
      delete updates.geom;
    } else {
      geomVal = null;
    }

    const updateKeys = Object.keys(updates);
    const updateValues = Object.values(updates);

    // Create the SET statement for the parameterized query.
    const parameterizedValues = updateKeys.map((k, index) => {
      return `${k} = $${index + 1 + 1}`;
    });
    const joinedTuples = parameterizedValues.join(", ");

    let queryText = `UPDATE ${table} SET ${joinedTuples} `;

    let query;
    // Handle case where using the Post GIS function ST_GeomFromText in the parameterized array
    // to update the POINT lat/lng creates a parsing error in parameterized query.
    if (geomVal) {
      query = `${queryText}, geom = ${geomVal} WHERE gid = $1`;
    } else {
      query = `${queryText} WHERE gid = $1`;
    }
    // The array of params should start with id because id = $1 in the parameterized array.
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
