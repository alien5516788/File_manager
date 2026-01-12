import os.path

import utils

def list_media():

    image = utils.get_config("mediaviewer", "IMAGE")
    if (image != None) and (not os.path.isfile("../user/" + image.get("source"))):
        utils.set_config("mediaviewer", "IMAGE", None)

    audio = utils.get_config("mediaviewer", "AUDIO")
    if (audio != None) and (not os.path.isfile("user/" + audio.get("source"))):
        utils.set_config("mediaviewer", "AUDIO", None)

    video = utils.get_config("mediaviewer", "VIDEO")
    if (video != None) and (not os.path.isfile("user/" + video.get("source"))):
        utils.set_config("mediaviewer", "VIDEO", None)

    text = utils.get_config("mediaviewer", "TEXT")
    if (text != None) and (not os.path.isfile("user/" + text.get("source"))):
        utils.set_config("mediaviewer", "TEXT", None)

    if text != None:
        
        with open(("user/" + text["source"]), "r") as txt:

            txtName = text["name"]
            txtContent = txt.read()

            text = {
                "name" : txtName,
                "source" : txtContent
            }

    openedMedia = utils.get_config("mediaviewer", "OPENED_MEDIA")

    media = {
        "image" : image,
        "audio" : audio,
        "video" : video,
        "text" : text,
        "openedmedia" : openedMedia
    }

    return media