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
        $("#manga").hide();
        $("#anime").on("click",function(e){
            e.preventDefault();
            $("#manga").hide();
            $("#Anime").fadeIn(3000);
        });
        $("#Manga").on("click",function(e){
            e.preventDefault();
            $("#Anime").hide();
            $("#manga").fadeIn(3000);
        });
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
        $('#news-vcards').animate({left : "-=1310"});
        });
        $('#right').on('click',function(){
            $('#news-vcards').animate({left : "+=1310"});
            });
});
  $("body").on("click",function(){
      $("#preloader").remove();
    });
     var video = document.querySelector('video');
    video.muted = true;
    video.play();