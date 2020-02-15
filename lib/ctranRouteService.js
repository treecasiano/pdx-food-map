let table = "ctran_route";

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
                      route_id,
                      rt_shrt_nm,
                      rt_long_nm,
                      rt_typ_txt,
                      rt_col_fmt,
                      rt_txt_col,
                      rt_txt_fmt,
                      type
                        ) t
              ) as "properties"
          FROM ${table}
      ) as f
  ) as fc;
    `;

    const result = await pg.query(query);
    return result[0]["row_to_json"];
  }
}

module.exports = factory;
