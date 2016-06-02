function App(){
    this.apiKey = 'c6dc8581507548e535e52e8cdb1dfde6';
    this.userId = '31363701@N00';
    this.photoPrefix = 'CWP-';
    this.photosets = [];
};

App.prototype = {
    init: function(){
        this.bindEvents();

        this.getPhotosets();
    },

    bindEvents: function(){
        this.dragScroll();
    },

    getPhotosets: function(){
        var xhr = $.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.apiKey + '&user_id=' + this.userId);

        var self = this;

        xhr.done(function(data){
            $(data).find('photoset').each(function(){
                var $this = $(this);
                var title = $this.find('title').text();

                if (title.indexOf(self.photoPrefix) !== 0) return;

                self.photosets.push({
                    title: title.substr(4),
                    id: this.id
                });
            });

            self.setAlbumList();

            var hash = window.location.hash;
            if (hash === ''){
                self.getPhotos({ id: self.photosets[0].id });
                $('#album-list').first('li').find('a').addClass('active');
            } else if (hash === 'about') {
                // @TODO - Show about page
            } else if (hash === 'contact') {
                // @TODO - Show contact page
            } else {
                var photosetToSelect = self.photosets.filter(function(obj){
                    return obj.title.toLowerCase() === hash.substr(1).toLowerCase();
                });

                if (photosetToSelect !== void 0) {
                    self.getPhotos(photosetToSelect[0]);
                }
            }
        });

        xhr.fail(function(err){
            console.error(err);
        });
    },

    setAlbumList: function(){
        this.photosets.forEach(function(obj){
            $('#album-list').append('<li><a href="#' + obj.title + '" data-album-id="' + obj.id + '">' + obj.title + '</a></li>');
        });
    },

    getPhotos: function(obj){
        var xhr = $.get('https://api.flickr.com/services/rest/' +
              '?method=flickr.photosets.getPhotos' +
              '&api_key=' + this.apiKey + 
              '&user_id=' + this.userId + 
              '&photoset_id=' + obj.id + 
              '&extras=description');
        var photos = [];
        var self = this;

        xhr.done(xhrDone);
        xhr.fail(xhrFail);

        function xhrDone(data){
            $(data).find('photo').each(function(i, obj){
                var url = 'https://farm' + obj.getAttribute('farm') + 
                          '.staticflickr.com/' + obj.getAttribute('server') + 
                          '/' + obj.getAttribute('id') + 
                          '_' + obj.getAttribute('secret') + '_c.jpg';

                var description = obj.getElementsByTagName('description')[0].innerHTML || '';

                photos.push({
                    url: url,
                    title: obj.getAttribute('title'),
                    description: description
                });
            });

            self.renderPhotos(photos);
        };

        function xhrFail(err){
            console.error(err);
        };
    },

    renderPhotos: function(photos){
        var html = '';

        $.each(photos, function(i, obj){
            html += '<img src="' + obj.url + '" alt="' + (obj.description || '') + '" title="'+ (obj.title || '') + '" class="nodrag" />';
        });

        console.log(html);

        $('#photo-container').html(html);
    },
    
    dragScroll: function(){
        var curYPos = 0;
        var curXPos = 0;
        var curDown = false;

        window.addEventListener('mousemove', function(e){ 
          if(curDown === true){
            window.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop);
          }
        });

        window.addEventListener('mousedown', function(e){
            curDown = true;
            curYPos = e.pageY;
            curXPos = e.pageX;
        });
        
        window.addEventListener('mouseup', function(e){
            curDown = false;
        });
    }
};

var app = new App();
app.init();