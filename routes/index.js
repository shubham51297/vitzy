var express = require('express');
var router = express.Router();

var monk=require('monk');
var db= monk('mongodb://127.0.0.1:27017/vidzy');
var collection= db.get("videos");
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos', function(req, res) {
  if (Object.keys(req.query).length === 0){
    collection.find({}, function(err, videos){
      if(err) throw err;
      res.render('index', {results: videos});
    });
  }
  console.log(Object(req.query).genre);
  collection.find({ title: {$regex : ".*"+Object(req.query).title+".*"},genre: {$regex : ".*"+Object(req.query).genre+".*"} },function(err,videos){
    if(err) throw err;
    res.render('index', {results: videos});
    //res.json(videos);
});
});

router.get('/videos/new', function(req, res, next) {
  res.render('new');
});

router.post('/videos', function(req,res){
  collection.insert({
     title: req.body.title,
     genre: req.body.genre,
     description: req.body.desc,
     image: req.body.image
  },function(err, video){
     if(err) throw err;
     res.redirect('/videos');
  });
});
router.post('/videos/search',function(req,res){
  //collection.find({ title: {$regex : ".*"+req.body.title+".*"} },function(err,videos){
      //if(err) throw err;
  res.redirect('/videos?title='+req.body.title+'&genre='+req.body.genre);
      //res.json(videos);
  //});
});
router.post('/videos/new/edit/:id', function(req,res){
  collection.update({_id: req.params.id},{
    $set:{
      title: req.body.title,
     genre: req.body.genre,
     description: req.body.desc,
     image: req.body.image
    }
     
  },function(err, video){
     if(err) throw err;
     res.redirect('/videos');
  });
});
router.post('/videos/edit/:id',function(req,res){
  collection.findOne({ _id: req.params.id},function(err,videos){
      if(err) throw err;
      res.render('edit', {video:videos});
  });
});

router.get('/videos/:id', function(req, res) {
  
  collection.findOne({ _id: req.params.id },function(err, videos){

      if(err) throw err;
      console.log(videos);
      res.render('show', {video:videos});

  });
}); 

router.put('/videos/:id', function(req, res) {
  collection.update({ _id: req.params.id },
      { $set: {
          title: req.body.title,
          genre: req.body.genre,
          description: req.body.desc

      }},function(err, videos){

      if(err) throw err;


  });
})

router.delete('/videos/:id', function(req, res) {
  collection.remove({ _id: req.params.id },function(err, videos){

      if(err) throw err;

      res.redirect('/videos');

  });
});

module.exports = router;
