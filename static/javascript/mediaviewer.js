"use strict";

$(document).ready(function(){

    load_media();
    
    // change viewer
    $(".chng-vwr").click(function(){

        $(".vwr").hide();
        $(".chng-vwr").css("border-bottom", "none");

        if (this.id === "img-vwr-btn"){
            $("#img-vwr-btn").css("border-bottom", "1px solid white");
            $(".img-vwr").css("display", "flex");
        }else if (this.id === "ad-plyr-btn"){
            $("#ad-plyr-btn").css("border-bottom", "1px solid white");
            $(".ad-plyr").css("display", "flex");
        }else if (this.id === "vd-plyr-btn"){
            $("#vd-plyr-btn").css("border-bottom", "1px solid white");
            $(".vd-plyr").css("display", "flex");
        }else if (this.id === "txt-edtr-btn"){
            $("#txt-edtr-btn").css("border-bottom", "1px solid white");
            $(".txt-edtr").css("display", "flex");
        };

    });

    // close viewer
    $(".vwr > h3 > i").on("click", function(){

        let viewer = $(this).parent().parent();
        let removeMedia = null;

        if (viewer.hasClass("img-vwr")){

            $(".img-vwr > h3").html("No media");
            $("#image").attr("src", "");
            $("#image").hide();
            $(".img-scrn > .tmp-img").show();

            $(".img-cntrls > button").prop("disabled", true);
            
            media.image = null;
            removeMedia = "image";

        }else if (viewer.hasClass("ad-plyr")){

            $(".ad-plyr > h3").html("No media");

            const audio = $("#audio");

            audio[0].pause();
            $("#audio > source").attr("src", "");
            audio[0].load();

            audio.hide();
            $("#audio-img").hide()
            $(".ad-scrn > .tmp-img").show();

            $(".ad-cntrls > button").prop("disabled", true);
            $(".ad-cntrls > input").prop("disabled", true);
            
            media.audio = null;
            removeMedia = "audio";

        }else if (viewer.hasClass("vd-plyr")){

            $(".vd-plyr > h3").html("No media");

            const video = $("#video");

            video[0].pause();
            $("#video > source").attr("src", "");
            video[0].load();

            video.hide();
            $(".vd-scrn > .tmp-img").show();

            $(".vd-cntrls > button").prop("disabled", true);
            $(".vd-cntrls > input").prop("disabled", true);
            
            media.video = null;
            removeMedia = "video";
            
        }else if (viewer.hasClass("txt-edtr")){

            $(".txt-edtr > h3").html("No media");

            $("#text").val("");

            $("#text").hide();
            $(".txt-scrn > .tmp-img").show();

            $(".txt-cntrls > button").prop("disabled", true);
            
            media.text = null;
            removeMedia = "text";
            
        }

        $.ajax({
            type: 'get',
            url: "/mediaviewer",
            data: {
                "closemedia" : true,
                "mediatype" : removeMedia
            },
            async: false,
            success: function(data){

                if (Object.keys(data).includes("alrt")){
                    custom_alert(data.alrt, data.alrttyp);
                    return;
                };

            },
            error: function(error){
    
                custom_alert("Server error", "error");
    
            }
        });

    });

    // image controls
    $("#img-fl-scrn-btn").click(function(){

        window.open(media.image.source, "blank");

    });

    // audio/video controls
    $("#ad-pl-ps-btn, #vd-pl-ps-btn").click(function(e){

        let media = null;
        let playButton = null;
        
        if (e.target.id === "ad-pl-ps-btn"){

            media = $("#audio")[0];
            playButton = $("#ad-pl-ps-btn");

        }else if(e.target.id === "vd-pl-ps-btn"){

            media = $("#video")[0];
            playButton = $("#vd-pl-ps-btn");

        };
        
        playButton.removeClass("fa-play fa-pause");

        if (media.paused){

            playButton.addClass("fa-pause");
            media.play();
            
        }else{

            playButton.addClass("fa-play");
            media.pause();

        };

    });

    $("#ad-sk, #vd-sk").change(function(e){

        let seekBarValue = null;
        let media = null;

        if (e.target.id === "ad-sk"){

            seekBarValue = $("#ad-sk").val();
            media = $("#audio")[0];

        }else if (e.target.id === "vd-sk"){

            seekBarValue = $("#vd-sk").val();
            media = $("#video")[0];

        };

        media.currentTime = (seekBarValue / 100) * media.duration;

    });

    $("#ad-vol-btn, #vd-vol-btn").click(function(e){

        let media = null;
        let volumeButton = null;
        
        if (e.target.id === "ad-vol-btn"){

            media = $("#audio")[0];
            volumeButton = $("#ad-vol-btn");

        }else if(e.target.id === "vd-vol-btn"){

            media = $("#video")[0];
            volumeButton = $("#vd-vol-btn");

        };

        volumeButton.removeClass("fa-volume fa-volume-slash");

        if (media.muted){

            volumeButton.addClass("fa-volume");
            media.muted = false;
            
        }else{

            volumeButton.addClass("fa-volume-slash");
            media.muted = true;

        };


    });

    $("#vd-fl-scrn-btn").click(function(){

        $("#vd-pl-ps-btn").addClass("fa-play");
        $("#video")[0].pause();

        window.open(media.video.source, "blank");

    });

    $("#audio, #video").on("timeupdate", function(e){

        let media = null;
        let seekBar = null;

        if (e.target.id === "audio"){

            media = $("#audio")[0];
            seekBar = $("#ad-sk");

        }else if(e.target.id === "video"){

            media = $("#video")[0];
            seekBar = $("#vd-sk");

        };

        seekBar.val((media.currentTime / media.duration) * 100);

    });

    $("#audio, #video").on("ended", function(){

        $("#ad-pl-ps-btn, #vd-pl-ps-btn").removeClass("fa-pause");

        if (this.id === "audio") $("#ad-pl-ps-btn").addClass("fa-play");
        else if (this.id === "video") $("#vd-pl-ps-btn").addClass("fa-play");

    });

    // text controls
    $("#txt-sv-btn").click(function(){
        
        const text = $("#text");

        media.text.source = text.val();

        $.ajax({
            type: 'post',
            url: "/mediaviewer",
            data: {
                "updatetext" : true,
                "text" : text.val() 
            },
            success: function(data){

                if (Object.keys(data).includes("alrt")){
                    custom_alert(data.alrt, data.alrttyp);
                    return;
                }

                custom_alert("Failed to save text", "alert");
            
            },error: function(error){
    
                custom_alert("Server error", "error");
    
            }
        });
    
    });

    $("#txt-rst-btn").click(function(){
        
        $("#text").val(media.text.source);

    });

    // show/hide controls
    $(".vwr").click(function(e){

        clearTimeout(controlsTimeOut);

        if (this.querySelector(".cntrls").contains(e.target) ||
        this.querySelector("h3").contains(e.target)) return;

        if (controlsTimeOut != null){

            hide_viewer_controls(this);
            return;

        };

        $(this).children("h3").css("display", "flex");
        $(this).children(".cntrls").css("display", "flex");

        controlsTimeOut = setTimeout(hide_viewer_controls, 3000, this);

    });

    $(".vwr").on("contextmenu", function(){
        
        clearTimeout(controlsTimeOut);
        hide_viewer_controls(this);

    });

});