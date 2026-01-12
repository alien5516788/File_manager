"use strict";

// load filemanager
var workingDir = null;
var folders = {};
var files = {};

function format_folder_name(folderName) {
  if (folderName.length > 20) {
    folderName = folderName.slice(0, 17) + "...";
  }

  return folderName;
}

function format_file_name(fileName) {
  let fileExtension = fileName.split(".");

  if (fileExtension.length > 1) {
    fileExtension = "." + fileExtension.at(-1);
  } else {
    fileExtension = "";
  }

  if (fileName.length > 20) {
    fileName = fileName
      .slice(0, fileName.length - fileExtension.length)
      .slice(0, 17);
    fileName += "..." + fileExtension;
  }

  return fileName;
}

function format_file_size(fileSize) {
  const sizes = [" B", " KB", " MB", " GB", " TB", " PB"];
  let size = 0;

  if ((fileSize + "").length <= 3) {
    size = fileSize + " B";
  } else {
    let formatNumber = (fileSize + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let power = formatNumber.split(",").length - 1;

    size = formatNumber.replace(",", ".").substr(0, 5) + sizes[power];
  }

  return size;
}

function load_file_manager(directoryInfomation = null) {
  // get directory informations
  let directoryInfo = null;

  if (directoryInfomation === null) {
    $.ajax({
      type: "get",
      url: "/filemanager",
      data: { listdirectory: true },
      caches: false,
      async: false,
      success: function (data) {
        directoryInfo = data;
      },
      error: function (error) {
        custom_alert("Server error", "error");
      },
    });
  } else {
    directoryInfo = directoryInfomation;
  }

  if (Object.keys(directoryInfo).includes("alrt")) {
    custom_alert(directoryInfo.alrt, directoryInfo.alrttyp);
    return;
  }

  // working directory
  workingDir = directoryInfo.workingdir;

  // folders
  folders = directoryInfo.folders;

  let folderNames = Object.keys(folders);
  let folderElement = "";

  for (let i = 0; i < folderNames.length; i++) {
    let folderName = folderNames.at(i);
    let folderId = "fdId" + (i + 1);
    let folderShortName = format_folder_name(folderName);

    folderElement += `
        <div class="folder" id="${folderId}" name="${folderName}">
            <img src="/static/images/folder.png">
            <p>${folderShortName}</p>
        </div>`;
  }

  $("#fld-cntnr").html(folderElement);

  // files
  files = directoryInfo.files;

  let fileNames = Object.keys(files);
  let fileElement = "";

  for (let i = 0; i < fileNames.length; i++) {
    let fileName = fileNames.at(i);
    let fileId = "flId" + (i + 1);
    let fileShortName = format_file_name(fileName);

    // ---------
    let src = "static/images/file.png";
    let fileType = files[fileName].mimetype.split("/")[0];

    // ---------

    fileElement += `
        <div class="file" id="${fileId}" name="${fileName}">
            <img src="${src}">
            <p>${fileShortName}</p>
        </div>`;
  }

  $("#fl-cntnr").html(fileElement);

  // update address bar
  $("#adrs-bar").val(workingDir);

  // highlight previous selection
  if (selection.workingdir === workingDir) {
    for (let i = 0; i < selection.items.length; i++) {
      let itemName = selection.items.at(i);

      $(`.folder[name="${itemName}"]`).css(
        "background-color",
        "rgba(100, 100, 100, 0.5)",
      );
      $(`.file[name="${itemName}"]`).css(
        "background-color",
        "rgba(100, 100, 100, 0.5)",
      );
    }
  }
}

// reset file upload
function reset_file_upload() {
  $("#upld-fl")[0].reset();
  $("#upld-prgrs").hide();
  $("#upld-prgrs > div").html("");
  $("#upld-prgrs > p").html("0 %");
  $("#upld-mnu > div").html("");
  $("#upld-mnu > button").prop("disabled", true);
}

// search item
var searchMode = false;

function search_item(name) {
  if (selectMode === true) reset_select();
  searchMode = true;

  let result = {
    folders: [],
    files: [],
  };

  $(".folder, .file").css("background-color", "rgb(0, 0, 0, 0)");

  let folderNames = Object.keys(folders);

  for (let i = 0; i < folderNames.length; i++) {
    let folderName = folderNames[i];

    if (name != folderName.substring(0, name.length)) continue;

    let folder = $(`.folder[name="${folderName}"]`);

    result.folders.push(folder.attr("id"));
    $(folder).css("background-color", "rgb(100, 100, 100, 0.8)");
  }

  let fileNames = Object.keys(files);

  for (let i = 0; i < fileNames.length; i++) {
    let fileName = fileNames[i];

    if (name != fileName.substring(0, name.length)) continue;

    let file = $(`.file[name="${fileName}"]`);

    result.files.push(file.attr("id"));
    $(file).css("background-color", "rgb(100, 100, 100, 0.8)");
  }

  return result;
}

function reset_search() {
  $("#srch-itms > input").val("");

  const searchButton = $("#srch-itms > button");
  searchButton.removeClass("fa-x");
  searchButton.addClass("fa-search");
  searchButton.css("font-size", "0.8rem");

  $("#srch-rslt").hide();
  $("#srch-rslt > p").html("");
  $("#srch-rslt > ul").html("");

  $(".folder, .file").css("background-color", "rgb(0, 0, 0, 0)");
}

// select items
var focusedItem = null;

var selectMode = false;
var selection = { workingdir: null, items: [] };
var selectAction = null;

function select_item(itemId) {
  if (searchMode === true) reset_search();
  selectMode = true;

  if (selection.workingdir != workingDir && selection.workingdir != null)
    reset_select();

  selection.workingdir = workingDir;

  let itemName = $("#" + itemId).attr("name");

  if (selection.items.includes(itemName)) {
    selection.items.splice(selection.items.indexOf(itemName), 1);
    $("#" + itemId).css("background-color", "rgba(0, 0, 0, 0)");
  } else {
    selection.items.push(itemName);
    $("#" + itemId).css("background-color", "rgba(100, 100, 100, 0.5)");
  }

  if (selection.items.length > 0) {
    $("#slct-itms > p").html(selection.items.length + " selected");
    $("#slct-itms").css("display", "flex");
  } else {
    reset_select();
  }
}

function is_selected(item) {
  if (item === null) return;

  let itemName = $("#" + item.id).attr("name");

  if (selection.items.includes(itemName)) return true;
  else return false;
}

function reset_select() {
  selectMode = false;

  selection = {
    workingdir: null,
    items: [],
  };

  selectAction = null;

  $(".folder, .file").css("background-color", "rgba(0, 0, 0, 0)");

  $("#slct-itms").hide();
  $("#slct-itms > p").html("");
}

// get media type
function get_media_type(name) {
  let mimeType = files[name].mimetype;

  if (mimeType === "None") return null;

  return mimeType.split("/")[0];
}
