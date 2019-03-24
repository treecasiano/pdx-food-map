let table = "hello_table";

function factory({ pg }) {
  return {
    get,
    list,
    update,
  };

  async function get(id) {
    // prettier-ignore
    const query =
`SELECT
  user_id,
  first_name,
  last_name,
  favorite_color,
  ST_AsText(geom) as geom
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
  ST_AsText(geom) as geom
FROM hello_table
  `;

    const result = await pg.query(query);
    return result;
  }

  async function update(id, updates) {
      if (typeof id!=="number") {
        throw new Error("id must be a number");
      }

      const params = [id];

      const setStatement = Object.keys(updates)
        .map(column => {
          let updateValue = `'${updates[column]}'`;
          if (column == "geom") {
            updateValue = `ST_GeomFromText('${updates[column]}', 4326)`;
          }
          return`${column} = ${updateValue}`;
        })
        .join(", ");

      console.log("UPDATES\n", setStatement);
      const query = `UPDATE ${table} SET ${setStatement} WHERE user_id = $1`;

    const result = await pg.query(query, params);
    return result;
  }  
}

module.exports = factory;
