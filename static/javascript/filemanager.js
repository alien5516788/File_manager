"use strict";

$(document).ready(function(){
    
    load_file_manager();

    // previous directory
    $("#back").click(function(){
    
        $.ajax({
            type: 'get',
            url: "/filemanager",
            data: {
                "prevdirectory" : true
            },
            success: function(data){

                load_file_manager(data);

            },
            error: function(error){

                custom_alert("Server error", "error");

            }
        });

    });

    
    // create file
    $("#fl").click(function(){ 
        
        $("#fl-mnu").css("display", "flex");

    });

    $("#crt-fl-btn").click(function(){
        
        let info = {
            "title" : "New file",
            "description" : "enter a file name",
            "value" : "",
            "closebutton" : "Cancel",
            "confirmbutton" : "Done"
        };
        
        custom_prompt(info, "prompt", function(fileName){

            $.ajax({
                type: 'post',
                url: "/filemanager",
                data: {
                    "createfile" : true,
                    "filename" : fileName
                },
                success: function(data){

                    load_file_manager(data);

                },
                error: function(error){

                    custom_alert("Server error", "error");

                }
            });

        });

    });
    
    // upload files
    $("#upld-fl-btn").click(function(){ 

        reset_file_upload();
        
        $("#upld-mnu").css("display", "flex");

    });

    $("#upld-fl > input").on("click", function(){

        reset_file_upload();

    });

    $("#upld-fl > input").on("input", function(){

        const fileInput = $("#upld-fl > input")[0].files;

        if (fileInput.length === 0) return;

        let fileUploadElement = "";

        for (let i = 0; i < fileInput.length; i++){

            let fileName = format_file_name(fileInput[i].name + "");
            let fileSize = format_file_size(fileInput[i].size + "");

            fileUploadElement += `
            <div class="upld-dtls">
                <p>${fileName}</p>
                <p>${fileSize}</p>
            </div>
            `;

        };

        $("#upld-mnu > div").html(fileUploadElement);
        $("#upld-mnu > button").prop("disabled", false);

    });

    $("#upld-fl").submit(function(e){

        e.preventDefault();

        const fileForm = new FormData($("#upld-fl")[0]);
        fileForm.append("uploadfile", true);

        $("#upld-prgrs").css("display", "flex");

        $.ajax({
            type: 'post',
            url: "/filemanager/upload",
            data: fileForm,
            processData : false,
            contentType : false,
            caches: false,
            xhr: function(){

                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener('progress', function(e) {

                    if (e.lengthComputable){

                        let complete = e.loaded / e.total;

                        $("#upld-prgrs > div").css("width", + Math.round(complete * 80) +"%");
                        $("#upld-prgrs > p").html(Math.round(complete * 100) +" %");
                    
                    };

                }, false);

                return xhr;

            },
            success: function(data){

                if (Object.keys(data).includes("alrt")){
                    custom_alert(data.alrt, data.alrttyp);
                    return;
                };

                load_file_manager(data);

            },
            error: function(error){
    
                custom_alert("Server error", "error");
    
            }
        });

        $("#upld-mnu > button").prop("disabled", true);

    });

    
    // create folder
    $("#fld").click(function(){

        let info = {
            "title" : "New folder",
            "description" : "enter a folder name",
            "value" : "",
            "closebutton" : "Cancel",
            "confirmbutton" : "Done"
        };

        custom_prompt(info, "prompt", function(folderName){

            $.ajax({
                type: 'post',
                url: "/filemanager",
                data: {
                    "createfolder" : true,
                    "foldername" : folderName
                },
                success: function(data){

                    load_file_manager(data);

                },
                error: function(error){

                    custom_alert("Server error", "error");

                }
            });

        });

    });

   
    // search
    $("#srch-itms > input").on("input, keyup", function(){

        let name = $("#srch-itms > input").val().trim();
        
        if (name.length === 0) {

            reset_search();
            $("#srch-itms > input").focus();
            return;
            
        };

        let result = search_item(name);
        let resultCount = result.folders.length + result.files.length;

        if (resultCount === 0) {

            $("#srch-rslt > p").html("No items");
            $("#srch-rslt > ul").html("");
            $("#srch-rslt").css("display", "flex");

            return;

        };

        let resultElement = "";
        
        for (let i in result.folders){
            
            let folderId = result.folders.at(i);
            let folderName = $("#" + folderId).attr("name");

            resultElement += `
            <li class="fnd-rslt">folder: <a href="#${folderId}">${folderName}</a></li>
            `;

        };

        for (let i in result.files){
            
            let fileId = result.files.at(i);
            let fileName = $("#" + fileId).attr("name");

            resultElement += `
            <li class="fnd-rslt">file: <a href="#${fileId}">${fileName}</a></li>
            `;
            
        };

        $("#srch-rslt > p").html(resultCount + " items found");
        $("#srch-rslt > ul").html(resultElement);
        $("#srch-rslt").css("display", "flex");
        
    });

    $("#srch-itms > input").focus(function(){
        
        const closeButton = $("#srch-itms > button");

        closeButton.removeClass("fa-search");
        closeButton.addClass("fa-x");
        closeButton.css("font-size", "0.6rem");
        
    });

    $("#srch-itms > input").blur(function(){ 
        
        if ($("#srch-itms > input").val().trim().length > 0) return;

        reset_search();

    });

    $("#srch-itms > button").mousedown(function(){

        reset_search();

        $("#srch-itms > input").focus();

    });


    // address bar
    $("#adrs-bar").blur(function(){ 

        $("#adrs-bar").val(workingDir);

    });


    // folder
    $("body").on("click", ".folder", function(){

        if (selectMode == true) return;

        let folderName = $(this).attr("name");

        $.ajax({
            type: 'get',
            url: "/filemanager",
            data: {
                "changedirectory" : true,
                "folder" : folderName
            },
            success: function(data){

                load_file_manager(data);

            },
            error: function(error){

                custom_alert("Server error", "error");

            }
        });

    });

    // file
    $("body").on("click", ".file", function(){ 

        if (selectMode == true) return;

        let fileName = $(this).attr("name");
        let mediaType = get_media_type(fileName);

        if (mediaType === null){

            custom_alert("Media not supported", "alert");
            return;

        };
    
        $.ajax({
            type: 'get',
            url: "/mediaviewer",
            data: {
                "mediaviewer" : true,
                "mediatype" : mediaType,
                "media" : fileName
            },
            success: function(data){

                if (Object.keys(data).includes("alrt")){
                    custom_alert(data.alrt, data.alrttyp);
                    return;
                };

                window.location = "/mediaviewer";
    
            },
            error: function(error){
    
                custom_alert("Server error", "error");
    
            }
        });
    
    });


    // context menu
    $("body").on("contextmenu", "#fld-cntnr, #fl-cntnr, .folder, .file", function(e){
            
        e.preventDefault();

        if (this.className === "folder" || this.className === "file") focusedItem = this;

        let mouseX = e.pageX;
        let mouseY = e.pageY;

        const contextMenu = $("#cntxt-mnu");

        if (mouseX + contextMenu.outerWidth() > window.innerWidth){
            mouseX -= contextMenu.outerWidth();
        };

        if (mouseY + contextMenu.outerHeight() > window.innerHeight){
            mouseY -= contextMenu.outerHeight();
        };
        
        contextMenu.css("top", mouseY);
        contextMenu.css("left", mouseX);

        contextMenu.css("display", "flex");
        
    });

    $("#slct-fl-fld-btn").click(function(){

        if (focusedItem === null) return;
        
        selectMode = true;

        select_item(focusedItem.id);

    });

    $("#dwnld-fl-fld-btn").click(function(){  
        
        if (focusedItem === null) return;

        if (selectMode === true) {

            if (selection.items.length > 1){

                custom_alert("More than one item is selected", "alert");
                return;
    
            };

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };

        let itemName = selection.items.at(0);
        
        let a = document.createElement("a");
        a.download = itemName;
        a.href = workingDir + "/" + itemName;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        reset_select();

    });

    $("#cut-fl-fld-btn").click(function(){

        if (focusedItem === null) return;
        
        if (selectMode === true) {

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };
        
        selectAction = "move";
        selectMode = false;

    });

    $("#cpy-fl-fld-btn").click(function(){
    
        if (focusedItem === null) return;
        
        if (selectMode === true) {

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };

        selectAction = "copy";
        selectMode = false;
        
    });

    $("#pst-fl-fld-btn").click(function(){

        if (selectAction != "move" && selectAction != "copy") {

            custom_alert("Nothing selected", "alert");

        };

        $.ajax({
            type: 'post',
            url: "/filemanager",
            data: {
                [selectAction] : true,
                "sourcedir" : selection.workingdir,
                "items" : JSON.stringify(selection.items)
            },
            success: function(data){

                load_file_manager(data);

            },
            error: function(error){

                custom_alert("Server error", "error");

            }
        });

        reset_select();
            
    });

    $("#rnm-fl-fld-btn").click(function(){

        if (focusedItem === null) return;

        if (selectMode === true) {

            if (selection.items.length > 1){

                custom_alert("More than one item is selected", "alert");
                return;
    
            };

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };

        let itemName = selection.items.at(0);

        let info = {
            "title" : "Rename item",
            "description" : "enter a name",
            "value" : itemName,
            "closebutton" : "Cancel",
            "confirmbutton" : "Done"
        };

        custom_prompt(info, "prompt", function(newName){

            $.ajax({
                type: 'post',
                url: "/filemanager",
                data: {
                    "rename" : true,
                    "itemname" : itemName,
                    "newname" : newName
                },
                success: function(data){

                    load_file_manager(data);

                },
                error: function(error){
        
                    custom_alert("Server error", "error");
        
                }
            });

        });

        reset_select();

    });

    $("#dtls-fl-fld-btn").click(function(){

        if (focusedItem === null) return;

        if (selectMode === true) {

            if (selection.items.length > 1){

                custom_alert("More than one item is selected", "alert");
                return;
    
            };

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };

        let itemName = selection.items.at(0);
        let details = null;
        let attributes = null;
        
        if (focusedItem.className === "folder"){

            details = folders[itemName]
            attributes = Object.keys(folders[itemName]);

        }else if(focusedItem.className === "file"){
            
            details = files[itemName]
            attributes = Object.keys(files[itemName]);

        };
        
        const detailsMenu = $("#dtls-mnu");
        let dtlsElement = "";
        
        for(let i = 0; i < attributes.length; i++){

            let attribute = attributes.at(i);

            dtlsElement +=
            `<div>
                <p class="dtl dtl-ttl">${attribute}</p>
                <p class="dtl dtl-dscrptn">${details[attribute]}</p>
            </div>
            `;

        };

        detailsMenu.html(dtlsElement);
        detailsMenu.css("display", "flex");

        reset_select();

    });

    $("#dlt-fl-fld-btn").click(function(){

        if (focusedItem === null) return;

        if (selectMode === false) {

            if (is_selected(focusedItem) === false){

                select_item(focusedItem.id);

            };

        }else{

            if (is_selected(focusedItem) === false){

                reset_select();
                select_item(focusedItem.id);

            };

        };

        let items = selection.items;

        $.ajax({
            type: 'post',
            url: "/filemanager",
            data: {
                "delete" : true,
                "items" : JSON.stringify(items)
            },
            success: function(data){

                load_file_manager(data);

            },
            error: function(error){

                custom_alert("Server error", "error");

            }
        });

        reset_select();
          
    });

    
    // select
    $("body").on("click", ".folder, .file",function(){
        
        if (selectMode === false) return;

        select_item(this.id);

    });

    $("#slct-itms > i").click(function(){

        reset_select();

    });


    // hide popups
    $("body").on("click", function(e){

        // file menu
        if (e.target.id != "fl") $("#fl-mnu").hide();
        
        // upload file
        if (!document.getElementById("upld-mnu").contains(e.target) &&
        !document.getElementById("upld-fl-btn").contains(e.target)) {
            
            $("#upld-mnu").hide();
            reset_file_upload();

        };

        // context menu
        $("#cntxt-mnu").hide();
        
        // details menu
        if (!document.getElementById("dtls-mnu").contains(e.target) &&
        !document.getElementById("dtls-fl-fld-btn").contains(e.target)) $("#dtls-mnu").hide();

        // focused item
        if (!document.getElementById("cntxt-mnu").contains(e.target)) focusedItem = null;

    });

    $("body").on("contextmenu", function(e){

        // file menu
        $("#fl-mnu").hide();
        
        // upload file
        $("#upld-mnu").hide();
        reset_file_upload();
        
        // context menu
        if (!document.getElementById("fld-cntnr").contains(e.target) &&
        !document.getElementById("fl-cntnr").contains(e.target)) $("#cntxt-mnu").hide();

        // details menu
        $("#dtls-mnu").hide();

        // focus
        let parentClass = $(e.target).parent().attr("class");
        if (parentClass != "folder" && parentClass != "file") focusedItem = null;

    });

});