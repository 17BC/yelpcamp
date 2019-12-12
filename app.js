var express 		= require("express");
    app 			= express(),
    bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),	
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User			= require("./models/user.js"),
	seedDb			= require("./seeds");

//requiring routes
var campgroundRoutes 	= require("./routes/campgrounds.js");
	commentRoutes		= require("./routes/comments.js");
	indexRoutes			= require("./routes/index.js");

console.log(process.env.DATABASEURL);

//Sets the environment variable to localhost in case DATABASEURL is null
//preventing the app from crashing
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_campDB_v10"

mongoose.set("useUnifiedTopology", true);

 mongoose.connect(url, {useNewUrlParser: true});

// mongoose.connect("mongodb+srv://17BC:BlueNoteJam@cluster0-dodsm.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB");
// }).catch(err => {
// 	console.log("ERROR", err.message);
// });

// mongoose.connect("mongodb+srv://17BC:BlueNoteJam@cluster0-dodsm.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDb();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Zenki is the ugliest cat in the world, But charming!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this passes the req.user and req.flash to every single template
//whatever is assigned to res.locals will be available to every template
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp Server has started...")
});