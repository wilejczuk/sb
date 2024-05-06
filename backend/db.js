const { Pool } = require('pg');

const pool = new Pool({
  user: 'sber',
  password: 'test',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  database: 'server_config',
});

const getUserByUsername = async (username) => {
  try {
    const query = `SELECT * FROM users WHERE name = $1`;
    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return null;  
    }
    return result.rows[0];  
  } catch (error) {
    throw error;
  }
}

const getUserServers = async (userId) => {
  try {
    const query = `SELECT * FROM servers WHERE id_user = $1`;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return null;  
    }
    return result.rows;  
  } catch (error) {
    throw error;
  }
}

const getUpdates = async () => {
  try {
    const query = `SELECT * FROM updates`;
    const result = await pool.query(query, []);
    
    if (result.rows.length === 0) {
      return null;  
    }
    return result.rows;  
  } catch (error) {
    throw error;
  }
}

const getInstallations = async (serverGUID) => {
  try {
    const queryUpdatePast = `UPDATE installations SET status = 'installed'
                              WHERE status = 'planned' and time < '${new Date().toLocaleString()}'`;
    await pool.query(queryUpdatePast, []);

    const query = `SELECT i.*, u.name FROM installations i
                    LEFT JOIN updates u on u.id = i.id_update
                    WHERE i.guid_server = $1
                    ORDER BY i.time`;
    const result = await pool.query(query, [serverGUID]);
    
    if (result.rows.length === 0) {
      return null;  
    }
    return result.rows;  
  } catch (error) {
    throw error;
  }
}

const addInstallation = async (serverGUID, updateId, time) => {
  try {
    const query = `INSERT INTO installations (guid_server, id_update, time, status) VALUES ($1, $2, $3, 'planned')`;
    const result = await pool.query(query, [serverGUID, updateId, time]);
    
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

const cancelInstallation = async (installationId) => {
  try {
    const query = `UPDATE installations SET status = 'canceled' WHERE id = $1`;
    const result = await pool.query(query, [installationId]);
    
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = { getUserByUsername, getUserServers, getUpdates, getInstallations, addInstallation, cancelInstallation };