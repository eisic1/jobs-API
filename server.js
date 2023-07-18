const express = require('express');
const app = express();
const systems = require('./routes/systemRoutes');

// middleware
app.use(express.json());

// routes
app.get('/hello', (req, res) =>{
    res.send('Jobs API')
})

app.use('/auth', systems);
app.use('/jobs', systems);

const port = 3000;

app.listen(port, console.log(`Server is listening on port ${port}...`))