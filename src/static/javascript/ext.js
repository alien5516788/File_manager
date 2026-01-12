"use strict";

// page mask
$("body").append(`<div class="page-mask"></div>`);

function open_page_mask(){

    $(".page-mask").show();

};

function close_page_mask(){

    $(".page-mask").hide();

};

$(".page-mask").on("click", function(e){

    if (document.getElementById("alrt-bx").contains(e.target)) return;

    if (document.getElementById("prmpt-bx").contains(e.target)) return;

    close_alert();
    close_prompt();
    close_page_mask();

});

$(".page-mask").on("contextmenu", function(e){

    if (document.getElementById("alrt-bx").contains(e.target)) return;

    if (document.getElementById("prmpt-bx").contains(e.target)) return;

    close_alert();
    close_prompt();
    close_page_mask();

});


// custom alert box
const alertBoxElement = `
<div id="alrt-bx">
    <div>
        <ico id="alrt-ico" class="fa-regular fa-gear" style="font-size:0.8rem; margin-left:15px;"></ico>
        <ico id="alrt-cls-btn" class="fa-regular fa-x" style="font-size:0.6rem; margin-right:15px;"></ico>
    </div>
    <p></p>
</div>
`;

$("body").append(alertBoxElement);

function custom_alert(message, type){
   
    if (type == "log"){

        console.log(message);
        return;

    };

    open_page_mask();

    $("#alrt-ico").removeClass("fa-circle-exclamation fa-gear fa-triangle-exclamation");
    
    if(type == "alert"){

        $("#alrt-bx").css("color", "rgb(0, 0, 0)"); 
        $("#alrt-ico").addClass("fa-circle-exclamation");

    }else if (type == "error"){

        $("#alrt-bx").css("color", "rgb(73, 73, 73)"); 
        $("#alrt-ico").addClass("fa-gear");

    }else if (type == "warn"){

        $("#alrt-bx").css("color", "rgb(200, 0, 0)"); 
        $("#alrt-ico").addClass("fa-triangle-exclamation");

    }else return;
    
    $("#alrt-bx p").html(message);
    $("#alrt-bx").css("top", "2vh");

};

function close_alert(){

    $("#alrt-bx").css("top", "-50vh");
    $("#alrt p").html("");

    close_page_mask();

};

$("#alrt-cls-btn").click(function(){

    close_alert();

});


// custom prompt
const promptBoxElement = `
<div id="prmpt-bx">
    <p id="prmpt-ttl"></p>
    <p id="prmpt-dscrptn"></p>
    <form id="prmpt-inpt">
        <input type="text" autocomplete="off">
        <button class="fa-regular fa-x" type="button"></button>
    </form>
    <div style="display:flex;">
        <button id="prmpt-cncl"></button>
        <button id="prmpt-cnf" type="submit" form="prmpt-inpt"></button>
    </div>
</div>
`;

$("body").append(promptBoxElement);

function custom_prompt(promptInfo, type, callBack){

    open_page_mask();

    if (type == "prompt"){

        $("#prmpt-inpt").show();

    }else if (type == "confirm"){

        $("#prmpt-inpt").hide();

    }else return;
    
    $("#prmpt-ttl").html(promptInfo.title);
    $("#prmpt-dscrptn").html(promptInfo.description);
    $("#prmpt-cncl").html(promptInfo.closebutton);
    $("#prmpt-cnf").html(promptInfo.confirmbutton);
    
    if (type === "prompt"){

        $("#prmpt-bx > form > input").val(promptInfo.value);
        $("#prmpt-bx > form > input").focus();

    };

    $("#prmpt-bx").css("top", "30vh");

    new Promise(function(){

        $("#prmpt-inpt").one("submit", function(e){

            e.preventDefault();
        
            let promptValue = $("#prmpt-bx > form > input").val().trim();

            close_prompt();
        
            if (promptValue.length > 0) callBack(promptValue);

        });

    });

};

function close_prompt(){
    
    $("#prmpt-bx").css("top", "-50vh");
    $("#prmpt-ttl").html("");
    $("#prmpt-dscrptn").html("");
    $("#prmpt-bx form input").val("");
    $("#prmpt-cncl").html("");
    $("#prmpt-cnf").html("");

    close_page_mask();

    $("#prmpt-inpt").unbind("submit");

};

$("#prmpt-bx > form > button").click(function(){

    const promptInput = $("#prmpt-bx > form > input");

    promptInput.val("");
    promptInput.focus();

});

$("#prmpt-cncl").click(function(){
    
    close_prompt();

});