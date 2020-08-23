const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Idea")
const Idea = mongoose.model("ideas")
const {ensureAuthentificated} = require("../helpers/off")
router.get('/add', ensureAuthentificated, function(req, res) {
    
    
    res.render('ideas/add');
  });

  router.get('/edit/:id', function(req, res) {
  Idea.findOne({
_id: req.params.id

  })
  .then(idea =>{
    if(idea.user != req.user.id){
      req.flash("error_msg", "not autherised")
    res.redirect("/ideas")
    }else {
      res.render('ideas/edit', {
        idea: idea
      });

    }
    
  });
    
  });

  router.get('/', ensureAuthentificated, function(req, res) {
  
      
    Idea.find({user: req.user.id})
    .sort({date: "desc"})
    .then(ideas => {

      res.render("ideas/index", {
        ideas: ideas
      });
    })
      
    });




router.post("/", ensureAuthentificated, (req, res) => {
let errors = [];
if(!req.body.details){
errors.push({text: "add details"})
}
if  (!req.body.title){
errors.push({text: "add title"})
}


if(errors.length > 0){
console.log(errors.length)
res.render("/add", {
  errors : errors,
  title: req.body.title,
  details: req.body.details
});
}
else{
console.log(errors.length)
const newUser = {

  title: req.body.title,
  details: req.body.details,
  user: req.user.id
}
  new Idea(newUser)
  .save()
  .then(idea => {
    req.flash("success_msg", "added");
    res.redirect("/ideas");
  })

}



});


router.put("/:id",ensureAuthentificated, (req, res) =>{
Idea.findOne({
  _id: req.params.id
})
.then(idea =>{
  idea.title = req.body.title;
  idea.details = req.body.details;
  idea.save()
  .then(idea =>
    {
      req.flash("success_msg", "edited");
      res.redirect("/ideas");

    })
})
});

router.delete("/:id",ensureAuthentificated, (req, res) =>{
Idea.remove({_id: req.params.id})
.then(()=>{
req.flash("success_msg", "removed");
res.redirect("/ideas");
});
});


module.exports = router;