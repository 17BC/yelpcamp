var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
	console.log(req.user);
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log("Something went wrong!");
			console.log(err);
		}else{
			res.render("campgrounds/index", {campGrounds: allCampgrounds});
		}
	});
});

//CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form 
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, image:image, description: desc, author: author}
	
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			res.redirect("/");
		}
	});
	
	
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - show info about a particular object in DB
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			if(!foundCampground){
				req.flash("error", "Item not found");
				return res.redirect("/campgrounds");
				
			}
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
		
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){	
	Campground.findById(req.params.id, function(err, foundCampground){	
		res.render("campgrounds/edit", {campground: foundCampground});			
	});		
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and remove the correct campground
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
	
 });
	
			  
//Middlewares




module.exports = router;