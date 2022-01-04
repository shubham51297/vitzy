var express = require('express');
var router = express.Router();

var monk=require('monk');

var db=monk('localhost:27017/vidzy');
var collection=db.get('videos');

//api/videos

router.get('/', function(req, res) {
    collection.find({},function(err, videos){

        if(err) throw err;

        res.json(videos);

    });
  //res.render('index', { title: 'Express' });
});

//api/videos/id
router.get('/:id', function(req, res) {
    collection.findOne({ _id: req.params.id },function(err, video){

        if(err) throw err;

        res.json(video);

    });
});

// insert new video

router.post('/', function(req, res) {
    collection.insert(
     { 

        title: req.body.title,
        genre: req.body.genre,
        description: req.body.desc

    } ,function(err, video){

        if(err) throw err;

        res.json(video);

    });
});

//update an existing video
router.put('/:id', function(req, res) {
    collection.update({ _id: req.params.id },
        { $set: {
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.desc

        }},function(err, video){

        if(err) throw err;

        res.json(video);

    });
});

//delete existing video

router.delete('/:id', function(req, res) {
    collection.remove({ _id: req.params.id },function(err, video){

        if(err) throw err;

        res.json(video);

    });
});

module.exports = router;


