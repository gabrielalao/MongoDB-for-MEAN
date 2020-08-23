const express = require("express");
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose")
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash")
const session = require("express-session")
const ideas = require("./routes/ideas")
const users = require("./routes/users")
const passport = require("passport")
require("./config/passport")(passport);
const db = require("./config/database");
const path = require("path");
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
.then(() => console.log("Mongo conected"))
.catch(err => console.log(err));



app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



app.use(function (req, res, next){
//console.log(Date.now());
req.name = "Kach"
next();
});

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, "public")));


app.use(methodOverride("_method"));
app.use(session({
  secret: "cat",
  resave: true,
  saveUninitialized: true
  
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});


app.get('/', function(req, res) {

  const title = "com on"
    res.render('index', {
      title: title
    });
  });
  


  app.get('/about', function(req, res) {
  
    const title = "com on"
      res.render('about', {
        title: title
      });
    });

    


app.use("/ideas", ideas);
app.use("/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => {
console.log(`Server started on port ${port}`)
});