from flask import Blueprint
from flask import render_template, request, make_response, url_for, redirect

import utils

home_route = Blueprint("home_route", __name__)
login_route = Blueprint("login_route", __name__)

@home_route.route("/", methods=['GET','POST'])
def home():
    return redirect(url_for("login_route.login"))


@login_route.route("/login", methods=['GET','POST'])
def login():




    sessionId = request.cookies.get("sessionid")
    
    if sessionId == utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("filemanager_route.filemanager"))      




    if request.method =="GET":

        req = request.args

        return render_template("login.html")


     

    if request.method == "POST":

        req = request.form

        if "username" in req.keys() and \
            "password" in req.keys():
            
            username = req["username"]
            password = req["password"]
            
            # check username
            if username != utils.get_config("user", "USERNAME"):
                return {"alrt" : "Username is incorrect",
                        "alrttyp" : "alert"}
            
            # check password
            passwordHash = utils.get_password_hash(password)
            
            if passwordHash != utils.get_config("user", "PASSWORD_HASH"):
                return {"alrt" : "Password is incorrect",
                        "alrttyp" : "alert"}
            
            # create session
            sessionId = utils.create_session()

            resp = make_response(url_for("filemanager_route.filemanager"))
            resp.set_cookie("sessionid", sessionId)

            return resp

        return render_template("login.html")
    
    


    return render_template("login.html")