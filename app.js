var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mysql = require('mysql2');
const bodyParser = require('body-parser');



// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // password : "Ronaldah@2023",
  database: 'flutter_project'
});

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/reservations', async(req,res) => {
  try {
    const hasil = connection.query(
      'SELECT * FROM reservations',
      function(err, results, fields) {
        //console.log(results); // results contains rows returned by server
        //console.log(fields); // fields contains extra meta data about results, if available
        res.json({
          results,
          // fields
        })
      }
    )
  } catch (error) {
    
  }
})

app.post('/post/test', async(req,res) => {
  try {
    const data = req.body;
  const query = `INSERT INTO reservations (selectedRoom, selectedPerson, selectedTime) VALUES (?, ?, ?)`;
  const values = [data.selectedRoom, data.selectedPerson, data.selectedTime];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    res.sendStatus(200);
  });
  } catch (error) {
    
  }
})

app.post('/register', async(req,res) => {
  try {
    const data = req.body;
  const query = `INSERT INTO users (username, email, gender, password, foto, no_telp, alamat) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [data.username, data.email, data.gender, data.password, data.foto, data.no_telp, data.alamat];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    res.sendStatus(200);
  });
  } catch (error) {
    
  }
})
app.post('/login', async(req,res) => {
  try {
    const data = req.body;
  const query = `select * from users where email = ? and password = ? limit 1`;
  const values = [data.email, data.password];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    if (result.length > 0) {
      // res.status(500)
      res.json({
        id : result[0].id,
        email : result[0].email,
        username : result[0].username,
        foto : result[0].foto
      }).status(200)
    }else{
      res.sendStatus(500)
    }
    // res.sendStatus(200);
  });
  } catch (error) {
    
  }
})

app.get('/getData/:email', async(req,res) => {
  try {
    // const data = req.body;
  const query = `select * from users where email = ? limit 1`;
  const values = [req.params.email];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    if (result.length > 0) {
      // res.status(500)
      res.json({
        id : result[0].id,
        email : result[0].email,
        username : result[0].username,
        gender : result[0].gender,
        foto : result[0].foto,
        no_telp : result[0].no_telp,
        alamat : result[0].alamat
      }).status(200)
    }else{
      res.sendStatus(500)
    }
    // res.sendStatus(200);
  });
  } catch (error) {
    
  }
})

app.post('/update/:email', async(req,res) => {
  try {
    // const data = req.body;
  const query = `update users set email = ? , username = ?, foto = ?, alamat = ?, no_telp = ? where email = ?`;
  const values = [req.body.email, req.body.username, req.body.foto, req.body.alamat, req.body.noTelp, req.params.email];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    console.log(result);
    res.sendStatus(200);
    // res.sendStatus(200);
  });
  } catch (error) {
    
  }
})

// res.json({
//   test : "hello"
// }
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(5000)