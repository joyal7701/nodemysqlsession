const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const userData = {
  fullname: "Joyal Shah",
  username: "joyal7701",
  password: "12345",
};

var app = express();

//incoming request as a JSON Format
app.use(express.json({}));
app.use(
  express.urlencoded({
    extended: true,
  })
);

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "dbsession",
};

var sessionConnection = mysql.createConnection(options);

var sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessiontbl",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  sessionConnection
);

app.use(
  session({
    key: "keyin",
    secret: "my secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/login", (req, res) => {
  const { username, password } = req.body;
  if (username != userData.username || password != userData.password) {
    return res
      .status(401)
      .json({ error: true, message: "Username or password is incorrect" });
  } else {
    req.session.userinfo = userData.fullname;
    res.send("Landing success");
  }
});

app.use("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (!err) {
      res.send("Log Out!");
    }
  });
});

app.use("/", function (req, res) {
  if (req.session.userinfo) {
    res.send("Hello " + req.session.userinfo + " Welcome");
  } else {
    res.send("Not Logged In");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ` + PORT);
});
