let table = "tm_stop";

function factory({ pg }) {
  return {
    getGeoJSON
  };

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
                      stop_id,
                      stop_name,
                      type
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
}

module.exports = factory;
