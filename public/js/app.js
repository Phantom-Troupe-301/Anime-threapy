$(window).on('load', function() {
    $('#status').fadeOut();
    $('#preloader').delay(10000).fadeOut('slow');
    $('body').delay(10000).css({ 'overflow': 'visible' });
});

$(document).ready(function() {
    //functions to switch between title and catagory buttons
    $("#search-by-catagory").hide();
    $("#search-by-title").hide();

    $("#title-btn").on("click", function() {
        $("#search-by-catagory").hide();
        $("#title-btn").toggleClass("active1");
        $("#catagory-btn").removeClass("active2");

        $("#search-by-title").fadeToggle()(1000);
    })
    $("#catagory-btn").on("click", function() {
            $("#search-by-title").hide();
            $("#title-btn").removeClass("active1");
            $("#search-by-catagory").fadeToggle(1000);
            $("#catagory-btn").toggleClass("active2");
        })
        //function for a the slider
    $('#vcards').width(function() {
        var width = 0;
        $('.vcard').each(function() {
            width += $(this).outerWidth(true);
        });
        return width;
    }());
    $('#arrow-right').on('click', function() {
        $('#vcards').animate({ left: "-=1160" });
    });
    $('#arrow-left').on('click', function() {
        $('#vcards').animate({ left: "+=1160" });
    });
    //function for heart button
    $('.like').click(function(e) {
        e.preventDefault();
        $(this).toggleClass("heart");
    });
    $('#news-vcards').width(function(){
        var width = 0;                
        $('.news-vcard').each(function(){
            width += $(this).outerWidth(true);
        });
        return width;
    }());
    $('#next').on('click',function(){
        $('#news-vcards').animate({left : "-=122"});
        });
});