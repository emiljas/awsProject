var express = require('express');
var router = express.Router();
var PicasaController = require("../../components/PicasaController.js");

router.get('/', function(req, res) {
    if(req.user) {
        var picasaController = new PicasaController(req.user.accessToken);
        picasaController.getAlbums(function(albums) {
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