let table = "csa_dropoff_site";

function factory({ pg }) {
  return {
    get,
    getGeoJSON,
    list,
    search
  };

  async function get(id) {
    // prettier-ignore
    const query =
`SELECT
  gid,
  name,
  type
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
  location_name
FROM ${table}
  `;

    const result = await pg.query(query);
    return result;
  }

  async function search(searchParams) {
    const { geom } = searchParams;
    const { distance } = searchParams;
    const query = `SELECT gid, farm_name, website, share_type, season, add_produc, snap, home_del, location, farmdescri, main_produ, ST_Distance(geom, ref_geom) AS distance
FROM ${table}
CROSS JOIN (SELECT ST_MakePoint(${geom})::geography AS ref_geom) AS r
WHERE ST_DWithin(geom, ref_geom, ${distance})
ORDER BY ST_Distance(geom, ref_geom);  `;
    const result = await pg.query(query);
    return result;
  }
}

module.exports = factory;
