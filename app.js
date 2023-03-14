const http = require('http');
const express = require('express');
const app= express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./api/routes/admin');
const categoryRoutes = require('./api/routes/category');
const blogRoutes = require('./api/routes/blog');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://hinamak:VY7Iavm6iu5q1Asr8toi@15.206.7.200:28017/hinamak?authMechanism=DEFAULT&authSource=admin');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-origin','*');
    res.header('Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/admin',adminRoutes);
app.use('/category',categoryRoutes);
app.use('/blog',blogRoutes);
app.use('/',userRoutes);

const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
