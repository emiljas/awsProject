var express = require('express');
var router = express.Router();
var url = require('url');
var PicasaClient = require("../../components/PicasaClient.js");

router.get('/', function(req, res) {
    var query = url.parse(req.url, true).query;
    var albumId = query.id;
    
    var picasaClient = new PicasaClient(req.user.accessToken);
    picasaClient.getPictures(albumId, function(pictures) {
        var viewModel = [];
        for(var i = 0; i < pictures.items.length; ++i) {
            var picture = pictures.items[i];
            viewModel.push({
                src: picture.thumbnail.url,
                href: "/filter?albumId=" + albumId + "&pictureId=" + picture.id
            });
        }
        
        res.render('album', {
            user: req.user,
            pictures: viewModel
        });
    });
});

module.exports = router;