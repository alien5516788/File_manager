from flask import Blueprint
from flask import render_template, request, url_for, redirect

import utils

settings_route = Blueprint("settings_route", __name__)

@settings_route.route("/settings", methods=['GET','POST'])
def settings():


  

    sessionId = request.cookies.get("sessionid")
    
    if sessionId != utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("login_route.login"))   




    if request.method == "GET":

        req = request.args

        if "settings" in req.keys():
            
            settingList = {
                "username" : utils.get_config("user", "USERNAME"),
            }

            return settingList
           
        return render_template("settings.html")




    if request.method =="POST":

        req = request.form

        if "updateusername" in req.keys() and \
            "username" in req.keys():

            userName = req.get("username")
            
            # check username length
            if not (8 <= len(userName)  <= 50): # type: ignore
                return {"alrt" : "Min 8 and max 50 characters required",
                        "alrttyp" : "alert"}
            
            # set username
            utils.set_config("user", "USERNAME", userName)
            
            settingList = {
                "username" : utils.get_config("user", "USERNAME"),
            }

            return settingList

        
        if "updatepassword" in req.keys() and \
            "oldpassword" in req.keys() and \
            "newpassword" in req.keys():
            
            oldPassword = req.get("oldpassword")
            newPassword = req.get("newpassword")
            
            # check old password
            oldPasswordHash = utils.get_password_hash(oldPassword)

            if oldPasswordHash != utils.get_config("user", "PASSWORD_HASH"):
                return {"alrt" : "Old password is incorrect",
                        "alrttyp" : "alert"}
            
            # check new password length
            if not (8 <= len(newPassword) <= 50): # type: ignore
                return {"alrt" : "Min 8 and max 50 characters required",
                        "alrttyp" : "alert"}
            
            # set password
            newPasswordHash = utils.get_password_hash(newPassword)

            utils.set_config("user", "PASSWORD_HASH", newPasswordHash)
            
            settingList = {
                "username" : utils.get_config("user", "USERNAME"),
            }

            return settingList

        return render_template("settings.html")




    return render_template("settings.html")