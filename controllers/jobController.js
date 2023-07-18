const db = require('../database/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function checkAuthorization(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: "Token not provided." });
    }
  
    // Provjeri valjanost i dekodiraj token
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token." });
      }
  
      // Spremi korisničke informacije u request kako biste ih mogli koristiti u kasnijim zahtjevima
      req.user = decoded;
      next();
    });
  }

const getAllJobs = (req, res) => {
    db.query('SELECT * FROM jobs WHERE user_id = ?', [req.user.userId], function(err, result){
        if(err) throw err;
        res.json(result);
    })
}

const createJobs = (req, res) => {
    const dateObject = new Date();
    const date = dateObject.toISOString().slice(0, 10);
    const values = [ req.body.company, req.body.position, date, req.body.status, req.user.userId ];
    const sql = 'INSERT INTO jobs (company, position, createdAt, status, user_id) VALUES (?, ?, ?, ?, ?);';

    db.query(sql, values, function(err, result){
        if(err) throw err;
        res.json({ message: 'Successeful added job.' });
    })
}

const getSingleJob = (req, res) => {
    const sql = 'SELECT * FROM jobs WHERE id = ? AND user_id = ?';

    db.query(sql, [req.params.id, req.user.userId], function(err, result){
        if(err) throw err;
        if(result && result.length) res.json(result[0]);
        else res.json({ message: 'There is no data for the requested job.' })
    })
}

const updateJob = (req, res) => {
    const dateObject = new Date();
    const date = dateObject.toISOString().slice(0, 10);
    const values = [ req.body.company, req.body.position, req.body.status, req.params.id, req.user.userId ];
    const sql = 'UPDATE jobs SET company = ?, position = ?, status = ? WHERE id = ? AND user_id = ?';

    db.query(sql, values, function(err, result){
        if(err) throw err;
        res.json({ message: 'Successeful updated job.' });
    })
}

const deleteJob = (req, res) => {
    db.query('DELETE FROM jobs WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], function(err, result) {
        if(err) {
            throw err;
        }
        res.json({ message: 'Job deleted successfully.' });
    })
}

module.exports = {
    getAllJobs,
    checkAuthorization,
    createJobs,
    getSingleJob,
    updateJob,
    deleteJob
}