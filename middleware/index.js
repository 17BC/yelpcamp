// this is named index.js because index file name is automatically required, no need to type it, Hence, (../middleware) when requiring it
var middlewareObj = {};

var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found!")
				res.redirect("back");
			}else{
				if(!foundCampground){
					req.flash("error", "Item not found");
					return res.redirect("back");
				}
				//does the user own the campground?
				if(foundCampground.author.id.equals(req.user.id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
				
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment does'nt exist!")
				res.redirect("back");
			}else{
				//does the user own the comment?
				if(foundComment.author.id.equals(req.user.id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
				
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}
module.exports = middlewareObj;