var express = require('express');
var router = express.Router();
var PicasaClient = require("../../components/PicasaClient.js");

router.get('/', function(req, res) {
    if(req.user) {
        var picasaClient = new PicasaClient(req.user.accessToken);
        picasaClient.getAlbums(function(albums) {
            res.render('index', {
                user: req.user,
                albums: albums
            }); 
        });
    }
    else
        res.render('index', {user: req.user, albums: null});
});

module.exports = router;