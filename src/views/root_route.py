from flask import Blueprint
from flask import request, url_for, redirect, send_from_directory
import os.path

import utils

root_route = Blueprint("root_route", __name__)

@root_route.route("/root/<path:filename>", methods=['GET']) # type: ignore
def root(filename):




    sessionId = request.cookies.get("sessionid")
    
    if sessionId != utils.get_config("user", "SESSION_ID"):
        return redirect(url_for("login_route.login"))   




    if request.method == "GET":

        req = request.args

        rootPath = "user" + os.path.dirname(request.path)
        fileName = os.path.basename(filename)

        return send_from_directory(rootPath, fileName)