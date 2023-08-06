from flask import Flask

from views import login_route, \
filemanager_route, mediaviewer_route, settings_route, \
root_route, favicon_route

import utils

# app
app = Flask(__name__)
app.secret_key = "i87e872bcfw6rv62efuv2b6"
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
app.config["DEBUG"] = True

app.register_blueprint(login_route.home_route)
app.register_blueprint(login_route.login_route)

app.register_blueprint(filemanager_route.filemanager_route)
app.register_blueprint(mediaviewer_route.mediaviewer_route)
app.register_blueprint(settings_route.settings_route)

app.register_blueprint(root_route.root_route)
app.register_blueprint(favicon_route.favicon_route)

# start server
if __name__ == "__main__":
    app.run(host = utils.get_config("server", "HOST"), port = utils.get_config("server", "PORT"))