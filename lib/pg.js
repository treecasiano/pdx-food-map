const { Pool, Client } = require('pg');
const config = require('config');

function factory({ config }) {
  // one-time connection pool to set up the postgres connection
  async function query(sqlQuery, sqlParams) {
    try {
      const pool = new Pool(config);
      // pool.query(sqlQuery, (err, res) => {
      //  pool.end();
      // });

      const { rows } = await pool.query(sqlQuery);
    
      return rows;

    } catch (e) {
      console.log(e.message);
      throw e;
    }
    
  }

  return {
    query,
  };
}

module.exports = factory;
