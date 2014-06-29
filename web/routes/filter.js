var express = require("express");
var router = express.Router();
var url = require('url');
var PicasaController = require("../../components/PicasaController.js");

router.get('/', function(req, res){
    var query = url.parse(req.url, true).query;
    
    var albumId = query.albumId;
    var pictureId = query.pictureId;
    
    var picasaController = new PicasaController(req.user.accessToken);
    picasaController.getPicture(albumId, pictureId, function(picture){
        res.render('filter', {
            user: req.user,
            pictureBefore: picture.url
        });
    });
});

module.exports = router;