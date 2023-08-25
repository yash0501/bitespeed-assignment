const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "sql9.freemysqlhosting.net",
  user: "sql9642236",
  password: "bCYqrazPbu",
  database: "sql9642236",
});

const dbServices = {
  async insertRecord(record) {
    const insertQuery =
      "INSERT INTO contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, ?)";
    const params = [record.email, record.phoneNumber, record.linkPrecedence];
    const query = mysql.format(insertQuery, params);
    console.log(record);
    console.log(query);
    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async updateRecord(record) {
    const updateQuery =
      "UPDATE contact SET linkedId = ?, linkedPrecedence = ? WHERE id = ?";
    const params = [record.linkedId, record.linkPrecedence, record.id];
    const query = mysql.format(updateQuery, params);

    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async getCompleteRecord(email, phoneNumber) {
    const selectQuery =
      "SELECT * FROM contact WHERE email = ? AND phoneNumber = ?";
    const params = [email, phoneNumber];
    const query = mysql.format(selectQuery, params);
    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async getPartialRecord(email, phoneNumber) {
    if (!email) {
      email = "dummy";
    }
    if (!phoneNumber) {
      phoneNumber = "-1";
    }

    const selectQuery =
      "SELECT * FROM contact WHERE email = ? OR phoneNumber = ?";
    const params = [email, phoneNumber];
    const query = mysql.format(selectQuery, params);

    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async getIdsFromEmailPhone(email, phoneNumber) {
    if (!email) {
      email = "dummy";
    }
    if (!phoneNumber) {
      phoneNumber = "-1";
    }
    const selectQuery =
      "SELECT id FROM contact WHERE email = ? OR phoneNumber = ?";
    const params = [email, phoneNumber];
    const query = mysql.format(selectQuery, params);
    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async getIdsFromIds(ids) {
    const selectQuery = "SELECT * FROM contact WHERE id IN (?)";
    const params = [ids];
    const query = mysql.format(selectQuery, params);
    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },

  async getRecordsByIds(ids) {
    const selectQuery = "SELECT * FROM contact WHERE id IN (?)";
    const params = [ids];
    const query = mysql.format(selectQuery, params);
    return new Promise((resolve, reject) => {
      pool.query(query, (err, result) => {
        if (err) {
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  },
};

module.exports = dbServices;
