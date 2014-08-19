var http = require("http");
var https = require("https");
var parseString = require('xml2js').parseString;

var PicasaClient = function(accessToken) {
    this.accessToken = accessToken;

    this.getResult = function(options, done)
    {
        var prot = options.port == 443 ? https : http;
        var req = prot.request(options, function(res)
        {
            var output = '';
            res.setEncoding('utf8');
    
            res.on('data', function (chunk) {
                output += chunk;
            });
    
            res.on('end', function() {
                done(res.statusCode, output);
            });
        });
    
        req.on('error', function(err) {
            throw Error(err);
        });
    
        req.end();
    };
    
    this.parseXml = function(xml, done) {
        parseString(xml, function(err, result) {
            if(err)
                throw err;
            
            done(result);
        });
    };
    
    this.parseAlbums = function(rawData) {
        var albums = {};
        albums.items = [];
        
        for(var i = 0; i < rawData.feed.entry.length; ++i) {
            var entry = rawData.feed.entry[i];
            
            albums.items.push({
                id: entry['gphoto:id'][0],
                title: entry.title[0]._
            });
        }
        
        return albums;
    };
    
    this.parsePictures = function(rawData) {
        var pictures = {};
        pictures.items = [];
        
        for(var i = 0; i < rawData.feed.entry.length; ++i) {
            var entry = rawData.feed.entry[i];
            var group = entry["media:group"][0];
            
            var picture = {
                id: entry["gphoto:id"],
                thumbnail: group["media:thumbnail"][2].$,
                main: group["media:content"][0].$
            };
            pictures.items.push(picture);
        }
        
        return pictures;
    };
    
    this.parsePicture = function(rawData) {
        var group = rawData.feed['media:group'][0];
        var content = group['media:content'][0].$;
        var fileName = group['media:title'][0]._;

        return {
            url: content.url,
            fileName: fileName
        };
    };
    
    this.generateOptions = function(path) {
        return {
            host: 'picasaweb.google.com',
            port: 443,
            path: path + '?access_token=' + this.accessToken,
            method: 'GET',
            headers: {
                'Content-Type': 'text/xml'
            }
        };
    };
};

PicasaClient.prototype.getAlbums = function(done) {
    var options = this.generateOptions('/data/feed/api/user/default/');
    
    this.getResult(options, function(statusCode, result) {
        this.parseXml(result, function(rawData) {
            done(this.parseAlbums(rawData));
        }.bind(this));
    }.bind(this));
};

PicasaClient.prototype.getPictures = function(albumId, done) {
    var options = this.generateOptions('/data/feed/api/user/default/albumid/' + albumId);
    
    this.getResult(options, function(statusCode, result) {
        this.parseXml(result, function(rawData) {
            done(this.parsePictures(rawData));
        }.bind(this));
    }.bind(this));
};

PicasaClient.prototype.getPicture = function(albumId, pictureId, done) {
    var path = '/data/feed/api/user/default/albumid/' + albumId + "/photoid/" + pictureId;
    var options = this.generateOptions(path);
    
    this.getResult(options, function(statusCode, result) {
        this.parseXml(result, function(rawData){
            done(this.parsePicture(rawData));
        }.bind(this));
    }.bind(this));
};

module.exports = PicasaClient;
