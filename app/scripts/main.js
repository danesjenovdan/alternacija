var tweetcount = 1;
var onlypublished = [];

function getData() {
    return $.getJSON('tweets.json', function(data) {
        $.each(data, function(i, o) {
            if (o.PUBLISHED == 'yes') {
                onlypublished.push(o);
            }
        });

        generateInitial(onlypublished);

        $('.loadercontainer').addClass('hidden');
        $('.tweetscomenext').removeClass('hidden');
    });
}

$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
  }
}

function generateInitial(tweets) {
    var sortedtweets = tweets.sort(function(a, b) {
        return parseFloat(a['ORDER']) - parseFloat(b['ORDER']);
    });

    $.each(sortedtweets.reverse(), function(i, tweet) {
        if (tweetcount % 10 !== 0) {
            if (i === tweetcount - 1) {
                $('.tweetscomehere').append('<div class="row tvitrow"><div class="col-md-12 col-lg-10 col-lg-offset-1"><img src="images/' + tweet['PERMANENT ID'] + 'from.png" data-other-image="images/' + tweet['PERMANENT ID'] + 'to.png" data-original-image="images/' + tweet['PERMANENT ID'] + 'from.png" class="img-responsive tvit" data-toggle="modal" data-target="#mobilesharemodal"></div></div>');
                // preload(['http://danesjenovdan.si/alternacija/images/' + String(tweet['PREMANENT ID']) + 'to.png']);
                var imageurl = 'http://danesjenovdan.si/alternacija/images/' + tweet['PERMANENT ID'] + 'to.png';
                // $.get(imageurl);
                $.preloadImages(imageurl);
                tweetcount = tweetcount + 1;
            }
        } else {
            $('.tweetscomehere').append('<div class="row tvitrow"><div class="col-md-12 col-lg-10 col-lg-offset-1"><img src="images/' + tweet['PERMANENT ID'] + 'from.png" data-other-image="images/' + tweet['PERMANENT ID'] + 'to.png" data-original-image="images/' + tweet['PERMANENT ID'] + 'from.png" class="img-responsive tvit" data-toggle="modal" data-target="#mobilesharemodal"></div></div>');
            tweetcount = tweetcount + 1;
            return false;
        }
    });
}

function loadMore(tweets) {
    var sortedtweets = tweets.sort(function(a, b) {
        return parseFloat(a['ORDER']) - parseFloat(b['ORDER']);
    });

    $.each(sortedtweets.reverse(), function(i, tweet) {
        console.log(i, tweetcount);
        if (tweetcount % (10 * Math.floor(tweetcount / 10)) !== 0) {
            if (i === tweetcount - 1) {
                $('.tweetscomehere').append('<div class="row tvitrow"><div class="col-md-12 col-lg-10 col-lg-offset-1"><img src="images/' + tweet['PERMANENT ID'] + 'from.png" data-other-image="images/' + tweet['PERMANENT ID'] + 'to.png" data-original-image="images/' + tweet['PERMANENT ID'] + 'from.png" class="img-responsive tvit" data-toggle="modal" data-target="#mobilesharemodal"></div></div>');
                tweetcount = tweetcount + 1;
            }
        } else {
            $('.tweetscomehere').append('<div class="row tvitrow"><div class="col-md-12 col-lg-10 col-lg-offset-1"><img src="images/' + tweet['PERMANENT ID'] + 'from.png" data-other-image="images/' + tweet['PERMANENT ID'] + 'to.png" data-original-image="images/' + tweet['PERMANENT ID'] + 'from.png" class="img-responsive tvit" data-toggle="modal" data-target="#mobilesharemodal"></div></div>');
            tweetcount = tweetcount + 1;
            return false;
        }
    });
}

$(document).ready(function() {

    getData();

    // social buttons
    $('.fb, .share-fb').on('click', function() {
        var url = 'https://www.facebook.com/dialog/share?app_id=301375193309601&display=popup&href=' + encodeURIComponent(document.location.href) + '&redirect_uri=' + encodeURIComponent(document.location.href) + '&ref=responsive';
        window.open(url, '_blank');
        return false;
    });

    $('.tw, .share-tw').on('click', function() {
        var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Fašizem je zgolj eno besedo stran, opozarjajmo nanj! #alternacija ' + document.location.href);
        window.open(url, '_blank');
        return false;
    });

    $('.email, .share-email').on('click', function() {
        var url = 'mailto:?subject=Alternacija&body=Fašizem je zgolj besedo stran, opozarjajmo nanj! ' + document.location.href;
        window.open(url, '_blank');
        return false;
    });


    // grow/shrink behaviour for .alternacija
    var lastScrollTop = 0;
    var scrolled = false;
    $(window).on('scroll', function() {
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
            if (st >= 50) {
                // downscroll code
                if (!scrolled) {
                    $('.alternacija').addClass('scrolled');
                    scrolled = true;
                }
            }
        } else {
            // upscroll code
            if (st <= 50) {
                $('.alternacija').removeClass('scrolled');
                scrolled = false;
            }
        }
        lastScrollTop = st;

        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            loadMore(onlypublished);
        }
    });

    // make .alternacija sticky
    $('.alternacija').sticky({});

    if (Modernizr.touch) {
        // .tvit ontouchstart events for mobile
        $(window).on('touchstart', function() {
            // $('.alternacija').css({
            //     'transition': 'none'
            // });

            $('body').addClass('naci');

            $.each($('.tvit'), function(i, e) {
                $(e).attr('src', $(e).data('other-image'));
            });
        });
        $(window).on('touchend', function() {
            $('body').removeClass('naci');
            $.each($('.tvit'), function(i, e) {
                $(e).attr('src', $(e).data('original-image'));
            });
            // var transitiontimeout = window.setTimeout(function() {
            //     $('.alternacija').css({
            //         'transition': 'all 0.4s linear'
            //     });
            // }, 100);
        });
    }
    // .tvit hover events for desktop
    $('body').on('mouseenter', '.tvit', function() {
        // $('.alternacija').css({
        //     'transition': 'none'
        // });
        $('body').addClass('naci');
        $(this).attr('src', $(this).data('other-image'));
    });
    $('body').on('mouseleave', '.tvit', function() {
        $('body').removeClass('naci');
        $(this).attr('src', $(this).data('original-image'));
        // var transitiontimeout = window.setTimeout(function() {
        //     $('.alternacija').css({
        //         'transition': 'all 0.4s linear'
        //     });
        // }, 100);
    });

    // .logo action
    $('.logo').on('click', function() {
        window.open('http://danesjenovdan.si', '_blank');
    });

    // .disclaimer button hover behaviour
    $('.disclaimer-button').hover(function() {
        $('.disclaimer').toggleClass('hidden');
        $('.overlay').toggleClass('hidden');
    }, function() {
        if (!$('.disclaimer').is(':hover')) {
            $('.disclaimer').toggleClass('hidden');
            $('.overlay').toggleClass('hidden');
        }
    });
    $('.disclaimer').hover(function() {}, function() {
        $('.disclaimer').toggleClass('hidden');
        $('.overlay').toggleClass('hidden');
    })

    // pošlji tvit
    $('#oddaj').on('click', function(e) {
        e.preventDefault();
        $('#oddaj').text('Pošiljam ...');
        $.post('https://sheetsu.com/apis/f41cf979', {
            'tweet': $('input[type="url"]').val()
        }, function(r) {
            if (r['status'] == 201) {
                $('input[type="url"]').val('Hvala za tvoj predlog!');
                $('#oddaj').text('Poslano');
                window.setTimeout(function() {
                    $('input[type="url"]').val('');
                    $('#oddaj').text('Pošlji');
                }, 3000);
            } else {
                alert('Ups, nekaj je šlo narobe, poskusi ponovno, ali se nam javi na Twittru ...');
            }
        });
    });

    // logo scroll
    $('.takemeup').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

});
