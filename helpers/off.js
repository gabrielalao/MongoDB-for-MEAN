module.exports = {
    ensureAuthentificated: function(req, res, next) {
if(req.isAuthenticated()){
    return next();

}
req.flash("error_msg", "not authentificated");
res.redirect("/users/login");

    }
}