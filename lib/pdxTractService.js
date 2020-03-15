let table = "pdx_metro_tracts";

function factory({ pg }) {
  return {
    get,
    getGeoJSON,
    list
  };

  async function get(id) {
    // prettier-ignore
    const query =
`SELECT
  state,
  county,
  geoid
FROM ${table}
WHERE
  gid = $1`;

    const result = await pg.query(query, [id]);
    return result[0];
  }

  async function getGeoJSON() {
    // prettier-ignore
    const query =
    `SELECT row_to_json(fc)
    from (
        SELECT
            'FeatureCollection' as "type",
            array_to_json(array_agg(f)) as "features"
        FROM (
            SELECT
                'Feature' as "type",
                ST_AsGeoJSON(ST_Transform(geom, 4326), 6) :: json as "geometry",
                (
                    SELECT json_strip_nulls(row_to_json(t))
                    FROM (
                        SELECT
                        gid,
                        county_1,
                        censustrac,
                        medianfami,
                        povertyrat,
                        lilatrac_1,
                        hunvflag,
                        pop2010,
                        urban,
                        state_1,
                        (ST_Area(geom::geography) / 1609.34^2) as area_sqmiles  
                          ) t
                ) as "properties"
            FROM ${table} 
            LIMIT 1000      
        ) as f
    ) as fc;
      `;

    const result = await pg.query(query);
    return result[0]["row_to_json"];
  }

  async function list() {
    // prettier-ignore
    const query =
`SELECT
  state,
  county,
  geoid
FROM ${table}
  `;

    const result = await pg.query(query);
    return result;
  }
}

module.exports = factory;
