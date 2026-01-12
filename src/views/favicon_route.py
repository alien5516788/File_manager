from flask import Blueprint
from flask import send_file

favicon_route = Blueprint("favicon_route", __name__)

@favicon_route.route("/favicon.ico", methods=['GET'])
def favicon():
    return send_file("static/images/file-manager.png")