let table = "users";

function factory({ pg }) {
  return {
    create,
    get,
    list
  };

  async function create(params) {
    const insertKeys = Object.keys(params);
    const insertValues = Object.keys(params)
      .map(column => {
        let insertValue = `'${params[column]}'`;
        return `${insertValue}`;
      })
      .join(", ");

    const query = `INSERT INTO ${table}(${insertKeys}) VALUES (${insertValues}) RETURNING *`;
    const result = await pg.query(query, params);
    return result[0];
  }

  async function get(username) {
    // prettier-ignore
    const query = `SELECT * FROM ${table} WHERE username = $1 LIMIT 1`;

    const result = await pg.query(query, [username]);
    // If no user found, an empty array is returned.
    return result;
  }

  async function list() {
    // prettier-ignore
    const query = `SELECT username, administrator FROM ${table}`;

    const result = await pg.query(query);
    return result;
  }
}
module.exports = factory;
