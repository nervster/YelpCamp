// all the middleware
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment")


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		
		Campground.findById(req.params.id,function(err, foundCampground){
			if(err){
				res.redirect("back")
			} else {
				// does the user own the campground
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back")
				}
				
			}
		});
	
		} else {
			res.redirect("back");
		}
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			console.log(err)
			res.redirect("/campgrounds")
		} else if(foundComment.author.id.equals(req.user._id)){
				  req.comment = foundComment;
				  next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	}
	
			
	)}};


middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please log in")
	res.redirect("/login");
}

module.exports = middlewareObj;