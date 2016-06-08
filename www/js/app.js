function App(){
    this.apiKey = 'c6dc8581507548e535e52e8cdb1dfde6';
    this.userId = '141580833@N07';
    this.photoPrefix = 'CWP - ';
    this.photosets = [];
    this.activeSet = 0;
};

App.prototype = {
    init: function(){
        this.bindEvents();
        this.route();
    },

    bindEvents: function(){
        $(window).on('hashchange', function(){
            this.route();
        }.bind(this));
        
        this.dragScroll();
    },
    
    route: function(){
        var curUrl = location.hash.split('#')[1] || '';
        
        // First load - fetch photosets
        if (this.photosets.length == 0) {
            this.getPhotosets();
            return;
        }
        
        if (curUrl == 'contact') {
            this.selectNavElement('contact');
            this.showContactArea();
            return;
        }
        
        // Check if any photoset === current URL
        var photosetToSelect = this.photosets.find(function(obj){
            return obj.title.toLowerCase() === curUrl.toLowerCase();
        });
        
        // No photosets match URL - change url to first photoset and trigger a 'replace'
        if (!photosetToSelect) {
            location.replace('#' + this.photosets[0].title);
            return;
        } else {
            this.activeSet = photosetToSelect.id;
        }
        
        this.selectNavElement(photosetToSelect.title)
        this.showPhotoArea();
    },
    
    selectNavElement: function(title){
        var $albumList = $('#album-list');
        
        $albumList.find('.active').removeClass('active');
        $albumList.find('a[href="#' + title +'"]').addClass('active');
    },

    getPhotosets: function(){
        var xhr = $.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.apiKey + '&user_id=' + this.userId);
        var self = this;
        
        // Clear the array, just in case there are issues with back/forward clickthroughs
        this.photosets = [];
        
        // @TODO - check localstorage for stored version. Album list could be updated every 15 minutes instead of on pageload.
        // ---------------

        xhr.done(function(data){
            $(data).find('photoset').each(function(){
                var $this = $(this);
                var title = $this.find('title').text();

                if (title.indexOf(self.photoPrefix) !== 0) return;

                self.photosets.push({
                    title: title.split(self.photoPrefix)[1],
                    id: this.id
                });
            });
            
            self.renderAlbumList();
            self.route();
        });

        xhr.fail(function(err){
            // @TODO - add error message saying album list couldn't be loaded
            console.error(err);
            
            // @TODO - perhaps try a few more times before giving up? Maybe check offline status?
        });
    },
    
    renderAlbumList: function(){
        var html = '';
        this.photosets.forEach(function(obj){
            html += '<li><a href="#' + obj.title + '" data-album-id="' + obj.id + '">' + obj.title + '</a></li>';
        });
        
        $('#album-list').prepend(html);
    },
    
    getPhotos: function(){
        var xhr = $.get('https://api.flickr.com/services/rest/' +
              '?method=flickr.photosets.getPhotos' +
              '&api_key=' + this.apiKey + 
              '&user_id=' + this.userId + 
              '&photoset_id=' + this.activeSet + 
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
                          '_' + obj.getAttribute('secret') + '_b.jpg';

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
            // @TODO - add error message saying images couldn't be loaded
            console.error(err);
        };
    },

    renderPhotos: function(photos){
        var html = '';

        $.each(photos, function(i, obj){
            html += '<img src="' + obj.url + '" alt="' + (obj.description || '') + '" data-title="'+ (obj.title || '') + '" />';
        });

        $('#photo-container').html(html);
    },
    
    showPhotoArea: function(){
        this.getPhotos();
        
        console.log('hide contact area');
    },
    
    showContactArea: function(){
        console.log('show contact area');
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