const { Pool, Client } = require("pg");
const config = require("config");

function factory({ config }) {
  // one-time connection pool to set up the postgres connection
  async function query(sqlQuery, sqlParams) {
    try {
      const pool = new Pool(config);

      const { rows } = await pool.query(sqlQuery, sqlParams);

      return rows;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  return {
    query
  };
}

module.exports = factory;
