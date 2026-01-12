from flask import Blueprint
from flask import render_template, request, url_for, redirect
import json

import file_manager
import utils

filemanager_route = Blueprint("filemanager_route", __name__)

@filemanager_route.route("/filemanager", methods=['GET','POST'])
def filemanager():
    



    sessionId = request.cookies.get("sessionid")
            
    if sessionId != utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("login_route.login"))




    if request.method == "GET":

        req = request.args

        if "listdirectory" in req.keys():

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act

        elif "prevdirectory" in req.keys():

            dirSequence = utils.get_config("filemanager", "DIR_SEQUENCE")
            workingDir = None

            if len(dirSequence) == 1 and dirSequence[0] == "root": workingDir = "/".join(dirSequence)
            else: workingDir = "/".join(dirSequence[0:-1])

            utils.set_config("filemanager", "DIR_SEQUENCE", workingDir.split("/"))
            act = file_manager.list_directory(workingDir)
            
            return act

        elif "changedirectory" in req.keys() and \
            "folder" in req.keys():

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE")) + "/" + str(req.get("folder"))
            utils.set_config("filemanager", "DIR_SEQUENCE", workingDir.split("/"))
            act = file_manager.list_directory(workingDir)
            
            return act
        
        return render_template("filemanager.html")
                    



    if request.method == "POST":

        req = request.form

        if "createfile" in req.keys() and \
            "filename" in req.keys():
            
            fileName = req.get("filename")

            act = file_manager.create_file(fileName)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act

        elif "createfolder" in req.keys() and \
            "foldername" in req.keys():
            
            folderName = req.get("foldername")

            act = file_manager.create_folder(folderName)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act   

        elif "copy" in req.keys() and \
            "sourcedir" in req.keys() and \
            "items" in req.keys():

            sourceDir = req.get("sourcedir")
            items = json.loads(req.get("items")) # type: ignore

            act = file_manager.copy_item(sourceDir, items)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act 

        elif "move" in req.keys() and \
            "sourcedir" in req.keys() and \
            "items" in req.keys():

            sourceDir = req.get("sourcedir")
            items = json.loads(req.get("items")) # type: ignore

            act = file_manager.move_item(sourceDir, items)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act

        elif "rename" in req.keys() and \
            "itemname" in req.keys() and \
            "newname" in req.keys():

            itemName = req.get("itemname")
            newName = req.get("newname")

            act = file_manager.rename_item(itemName, newName)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act

        elif "delete" in req.keys() and \
            "items" in req.keys():

            items = json.loads(req.get("items")) # type: ignore
            
            act = file_manager.delete_item(items)

            if act != True: return act

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.list_directory(workingDir)

            return act

        return render_template("filemanager.html")




    return render_template("filemanager.html")




@filemanager_route.route("/filemanager/upload", methods=['GET','POST'])
def upload():
    



    sessionId = request.cookies.get("sessionid")
    
    if sessionId != utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("login_route.login"))




    if request.method == "POST":

        req = request.form

        if "uploadfile" in req.keys():
            
            files = request.files.get("files")

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            act = file_manager.upload_file(files, workingDir)

            if act != True: return act
            
            act = file_manager.list_directory(workingDir)

            return act

        return render_template("filemanager.html")
    



    return render_template("filemanager.html")