var express = require("express");
var router = express.Router();
var url = require('url');
var PicasaClient = require("../../components/PicasaClient.js");

router.get('/', function(req, res){
    var query = url.parse(req.url, true).query;
    
    var albumId = query.albumId;
    var pictureId = query.pictureId;
    
    var picasaClient = new PicasaClient(req.user.accessToken);
    picasaClient.getPicture(albumId, pictureId, function(picture){
        res.render('filter', {
            user: req.user,
            pictureBefore: picture.url
        });
    });
});

module.exports = router;