// const express = require('express');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// const app = express();
// const connection = require('./config/conn');

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
// app.use(passport.initialize());


// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log(`Server running on port ! ${port}`);
// });
require('babel-register');
require('babel-polyfill');
require('./server/index');

