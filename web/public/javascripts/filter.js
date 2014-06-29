(function(){
    "use strict";
    
    //todo: move outside
    function getQueryParameterByName(name) {
        var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    
    $('#btnProcessPicture').click(function(){
        var albumId = getQueryParameterByName('albumId');
        var pictureId = getQueryParameterByName('pictureId');
        
        $.ajax({
            url: "/process",
            data: {
                albumId: albumId,
                pictureId: pictureId
            }
        }).done(function(data) {
            console.log('process');
        });
        
    });
})();