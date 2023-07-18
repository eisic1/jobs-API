const db = require('../database/db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signUp = (req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password) {
        res.status(401).json({ message: 'Please enter all requested information!' });
        return;
    }
        
    db.query('SELECT * FROM users WHERE email = ?', [req.body.email], function(err, result){
        if(err) throw err;
        if(result && result.length) res.json({ message: 'There is already a user with the given data!' });
        else{
            bcrypt.hash(req.body.password, 10, (error, hash) => {
                if (error) {
                  throw error
                } 

                const values = [req.body.name, req.body.email, hash];
                db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', values, function(err, result){
                    if(err) {
                        return res.send('Error adding data.', err);
                    }
                    res.json({ message: 'Successfully added user.' });
                })
            });
        }
    })

}

const login = (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.status(401).json({ message: 'Please enter all requested information!' });
        return;
    }

    db.query('SELECT * FROM users WHERE email = ?', [req.body.email], function(err, result){
        if(err) throw err;
        if(result && result.length) {
            bcrypt.compare(req.body.password, result[0].password, (error, response) => {
                if (error) {
                  throw error
                } else if (response) {
                  // Login is correct
                  const token = jwt.sign({
                    email: result[0].email,
                    userId: result[0].id
                  }, 'secret', function(e, tok){
                    res.json({
                        message: 'Authentication successful!',
                        name: result[0].name,
                        token: tok
                    });
                  })
                } else {
                  // Login is incorrect
                  res.status(401).json({ message: 'Incorrect data!' });
                }
            });
        }
        else{
            res.status(400).json({ message: 'Incorrect data!' });
        }
    })
}

module.exports = {
    signUp,
    login
}