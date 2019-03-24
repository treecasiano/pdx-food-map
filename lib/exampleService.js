function factory({ pg }) {
  return {
    get,
    list,
  };

  async function get(id) {
    // prettier-ignore
    const query =
`SELECT
  user_id,
  first_name,
  last_name,
  favorite_color
FROM hello_table
WHERE 
  user_id = $1`;

    const result = await pg.query(query, [id] );
    return result[0];
  }

  async function list() {
    // prettier-ignore
    const query =
`SELECT
  user_id,
  first_name,
  last_name,
  favorite_color
FROM hello_table
  `;

    const result = await pg.query(query);
    return result;
  }
}

module.exports = factory;
