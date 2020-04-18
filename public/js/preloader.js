'use strict'
$(window).on('load', function() {
    $('#status').fadeOut();
    $('#preloader').delay(10000).fadeOut('slow');
    $('body').delay(10000).css({ 'overflow': 'visible' });
});