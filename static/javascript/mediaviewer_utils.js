"use strict";

var media = null;

function format_file_name(fileName){

    let fileExtension = fileName.split(".");

    if (fileExtension.length > 1){ 

        fileExtension = "." + fileExtension.at(-1);

    }else{

        fileExtension = ""; 

    };
    
    if (fileName.length > 30){

        fileName = fileName.slice(0, (fileName.length - fileExtension.length)).slice(0, 27);
        fileName += "..." + fileExtension;

    };

    return fileName

};

function load_media(){

    $.ajax({
        type: 'get',
        url: "/mediaviewer",
        data: {
            "mediainformation" : true
        },
        async: false,
        success: function(data){

            media = data;

        },
        error: function(error){

            custom_alert("Server error", "error");

        }
    });

    if (Object.keys(media).includes("alrt")){
        custom_alert(media.alrt, media.alrttyp);
        return;
    };

    if (media.image != null) {

        let title = format_file_name(media.image.name) + "<i class='fa-regular fa-x'></i>";

        $(".img-vwr > h3").html(title);
        $("#image").attr("src", media.image.source);
        $(".img-scrn > .tmp-img").hide();
        $("#image").show();

        $(".img-cntrls > button").prop("disabled", false);

    };

    if (media.audio != null) {

        let title = format_file_name(media.audio.name) + "<i class='fa-regular fa-x'></i>";
        
        $(".ad-plyr > h3").html(title);
        $("#audio > source").attr("src", media.audio.source);
        $(".ad-scrn > .tmp-img").hide();
        $("#audio-img").show()
        $("#audio").show();
        $("#audio")[0].load();

        $(".ad-cntrls > button").prop("disabled", false);
        $(".ad-cntrls > input").prop("disabled", false);

    };

    if (media.video != null) {

        let title = format_file_name(media.video.name) + "<i class='fa-regular fa-x'></i>";
        
        $(".vd-plyr > h3").html(title);
        $("#video > source").attr("src", media.video.source);
        $(".vd-scrn > .tmp-img").hide();
        $("#video").show();
        $("#video")[0].load();

        $(".vd-cntrls > button").prop("disabled", false);
        $(".vd-cntrls > input").prop("disabled", false);
        
    };

    if (media.text != null) {

        let title = format_file_name(media.text.name) + "<i class='fa-regular fa-x'></i>";
        
        $(".txt-edtr > h3").html(title);
        $("#text").html(media.text.source);
        $(".txt-scrn > .tmp-img").hide();
        $("#text").show();

        $(".txt-cntrls > button").prop("disabled", false);

    };
    
    if (media.openedmedia === "image") $("#img-vwr-btn").trigger("click");
    else if (media.openedmedia === "audio") $("#ad-plyr-btn").trigger("click");
    else if (media.openedmedia === "video") $("#vd-plyr-btn").trigger("click");
    else if (media.openedmedia === "text") $("#txt-edtr-btn").trigger("click"); // not working

};


var controlsTimeOut = null;

function hide_viewer_controls(viewer){
    
    $(viewer).children("h3").hide();
    $(viewer).children(".cntrls").hide();

    controlsTimeOut = null;

};