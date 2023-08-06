from flask import Blueprint
from flask import render_template, request, url_for, redirect

import media_viewer
import utils

mediaviewer_route = Blueprint("mediaviewer_route", __name__)

@mediaviewer_route.route("/mediaviewer", methods=['GET','POST'])
def mediaviewer():


  

    sessionId = request.cookies.get("sessionid")
    
    if sessionId != utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("login_route.login"))   




    if request.method == "GET":

        req = request.args

        if "mediainformation" in req.keys():

            act = media_viewer.list_media()

            utils.set_config("mediaviewer", "OPENED_MEDIA", None)
            
            return act
        
        elif "mediaviewer" in req.keys() and \
            "mediatype" in req.keys() and \
            "media" in req.keys():

            mediaType = req.get("mediatype")
            mediaName = req.get("media")

            workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
            mediaSource = workingDir + "/" + mediaName # type: ignore

            media = {
                    "name" : mediaName,
                    "source" : mediaSource
                }
            
            mediaTypes = ["image", "audio", "video", "text"]

            if mediaType in mediaTypes: utils.set_config("mediaviewer", mediaType.upper(), media)

            else: return {"alrt" : "Media not supported",
                        "alrttyp" : "alert"}
            
            utils.set_config("mediaviewer", "OPENED_MEDIA", mediaType)
            
            return ""
        
        elif "closemedia" in req.keys() and \
            "mediatype" in req.keys():

            mediaType = req.get("mediatype")

            mediaTypes = ["image", "audio", "video", "text"]

            if mediaType in mediaTypes: mediaType = mediaType.upper()

            else: return {"alrt" : "Can't close media",
                         "alrttyp" : "alert"}

            utils.set_config("mediaviewer", mediaType, None)

            return ""

        return render_template("mediaviewer.html")




    if request.method =="POST":

        req = request.form

        if "updatetext" in req.keys() and \
            "text" in req.keys():
            
            text = req.get("text")

            file = utils.get_config("mediaviewer", "TEXT")

            with open(f"user/{file.get('source')}", "w") as fl:
                fl.write(text) # type: ignore

            return {"alrt" : "Content saved",
                    "alrttyp" : "alert"}

        return render_template("mediaviewer.html")




    return render_template("mediaviewer.html")