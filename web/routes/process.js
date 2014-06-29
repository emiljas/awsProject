var express = require("express");
var router = express.Router();
var url = require('url');

router.get('/', function(req, res) {
    var query = url.parse(req.url, true).query;
    
    var albumId = query.albumId;
    var pictureId = query.pictureId;
    
    console.log(pictureId);
    console.log(albumId);
    
    res.send('success');
});

module.exports = router;