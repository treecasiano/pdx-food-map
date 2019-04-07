let table = "farmers_markets";

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
    const query =
  `SELECT jsonb_build_object(
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
  name,
  type
FROM ${table}
  `;

    const result = await pg.query(query);
    return result;
  }
}

module.exports = factory;
