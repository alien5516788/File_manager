import time
from hashlib import sha256
from uuid import uuid4
import os
import mimetypes
import json

def get_config(category, key):
    
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
    
    value = config[category][key]

    return value

def set_config(category, key, value):
    
    with open("config.json", "r") as config_file:
        config = json.load(config_file)
        config[category][key] = value

    with open("config.json", "w") as config_file:
        json.dump(config, config_file, indent = 4)

    return True

def write_log(message, remark, printMessage = False):

    log = f"{time.ctime()} : {str(message)} : {remark}\n"
    fileName = get_config("server", "LOG_PATH")

    errLog = open(fileName, "a")
    errLog.write(log)
    errLog.close()
    
    if printMessage == True: print(log)


def get_password_hash(password):

    passwordHash = sha256(password.encode()).hexdigest() # type: ignore
    return passwordHash

def create_session():
    
    sessionId = uuid4().hex
    set_config("user", "SESSION_ID", sessionId)

    return sessionId

def delete_session():

    set_config("user", "SESSION_ID", None)

    return


def getSize(workingDir, itemName):

    getSize = os.path.getsize
    joinpt = os.path.join
    isLnk = os.path.islink

    itemPath = f"user/{workingDir}/{itemName}"
    size = 0
    
    # folder
    if os.path.isdir(itemPath):

        for dirpath, dirnames, filenames in os.walk(itemPath):
            for f in filenames:
                fp = joinpt(dirpath, f)
                if not isLnk(fp):
                    size += getSize(fp)
                    
    # file
    elif os.path.isfile(itemPath):
        size = getSize(itemPath)

    # format size
    sizes = [" B", " KB", " MB", " GB", " TB", " PB"]

    if len(str(size)) <= 3:
        size = str(size) + " B"
    
    else:
        formatNumber = f"{size:,}"
        power = len(formatNumber.split(",")) - 1
        
        size = formatNumber.replace(",", ".")[0:5] + sizes[power]

    return size

def getMIME(itemname):

    mime = mimetypes.guess_type(itemname)[0]
    return mime

def seperate_filename(fileName):
    
    fileExtension = fileName.split(".")

    if len(fileExtension) == 1:
        fileExtension = ""
    
    else:
        fileName = "".join(fileExtension[:-1])
        fileExtension = fileExtension[-1]

    return fileName, fileExtension