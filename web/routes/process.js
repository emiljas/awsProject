var express = require("express");
var router = express.Router();
var url = require('url');
var PictureService = require("../../services/PictureService.js");

router.get('/', function(req, res) {
    var query = url.parse(req.url, true).query;
    var pictureService = new PictureService();

    var info = {
    	accessToken: req.user.accessToken,
    	albumId: query.albumId,
    	pictureId: query.pictureId
    };
    pictureService.sendPictureToProcessingQueue(info, function(picture) {
        var result = {
            success: true,
            pictureUrl: pictureService.generatePictureUrl(picture)
        };
        res.send(JSON.stringify(result));
    });
});

module.exports = router;
