var express = require("express");
var router	= express.Router();
var passport = require("passport");
var User = require("../models/user.js");


//Root route
router.get("/", function(req, res){
	res.render("landing");
});


//show sign up form
router.get("/register", function(req, res){
	res.render("register");
});


// handling user sign up
router.post("/register", function(req, res){
	console.log(req.body.username);
	console.log(req.body.password);
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			// return res.render("register");
			res.redirect("/register");
		}
		// this will sign in the user
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//================================
// 			LOGIN ROUTES
//================================
// render login form
router.get("/login", function(req, res){
	res.render("login");
});

//login logic
//middleware
// router.post("/login", passport.authenticate("local", 
// 	{
// 		successRedirect: "/campgrounds",
// 		failureRedirect: "/login"
// 	}), function(req, res){
	
// });


//custom callback for passport.authenticate middleware
router.post("/login", function(req, res, next){
	passport.authenticate("local", function(err, user, info){
		if(err){ 
			req.flash("error", "Something went wrong!");
			return next(err);
		}
		if(!user){ 
			req.flash("error", "Username and Password does'nt match or not registered!");
			return res.redirect("/login");
		}
		
		req.login(user, function(err){
			if(err){
				return next(err);
			}
			req.flash("success", "Welcome back " + user.username);
			return res.redirect("/campgrounds");
		});	
	})(req, res, next);	
});

//===============================
//		LOGOUT ROUTES
//===============================
//logging out the user
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You are Logged Out");
	res.redirect("/campgrounds");
});



module.exports = router;