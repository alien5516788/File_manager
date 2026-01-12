from werkzeug.utils import secure_filename
import os
import shutil
import re

import utils


def list_directory(workingDir):
    
    ls = os.listdir(f"user/{workingDir}")
    isFile = os.path.isfile
    isDir = os.path.isdir
    gtSize = utils.getSize
    gtMIME = utils.getMIME
    
    folders = {}
    files = {}
   
    for item in ls:

        itemPath = f"user/{workingDir}/{item}"

        if isDir(itemPath):

            folders[item] = {
                "name" : item,
                "address" : f"user/{workingDir}/{item}",
                "size" : f"{gtSize(workingDir, item)}",
                "mimetype" : "folder"
            }

        elif isFile(itemPath):

            files[item] = {
                "name" : item,
                "address" : f"user/{workingDir}/{item}",
                "size" : f"{gtSize(workingDir, item)}",
                "mimetype" : f"{gtMIME(item)}"
            }

    items = {
        "workingdir" : workingDir,
        "folders" : folders,
        "files" : files}
    
    return items

def create_folder(folderName):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))

    # check if name contain prohibted characters
    prohibitedChars = utils.get_config("filemanager", "PROHIBITED_CHARS")

    if re.findall(prohibitedChars, folderName): 
        return {"alrt" : "Folder name contains prohibited charactors",
                "alrttyp" : "warn"}
    
    itemPath = f"user/{workingDir}/{folderName}"
   
    # check if folder already exist
    if os.path.isdir(itemPath):
        return {"alrt" : "Folder already exists",
                "alrttyp" : "alert"}

    # check if file with same name already exist
    if os.path.isfile(itemPath):
        return {"alrt" : "A file with the same name already exists",
                "alrttyp" : "alert"}

    # create folder
    os.mkdir(itemPath)

    return True

def create_file(fileName):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))

    # check if name contain prohibted characters
    prohibitedChars = utils.get_config("filemanager", "PROHIBITED_CHARS")

    if re.findall(prohibitedChars, fileName): 
        return {"alrt" : "File name contains prohibited charactors",
                "alrttyp" : "warn"}

    itemPath = f"user/{workingDir}/{fileName}"

    # check if file already exists
    if os.path.isfile(itemPath):
        return {"alrt" : "File already exists",
                "alrttyp" : "alert"}

    # check if folder with same name already exist
    if os.path.isdir(itemPath):
        return {"alrt" : "Folder with the same name already exists",
                "alrttyp" : "alert"}

    # create file
    open(itemPath, "w").close()

    return True


def copy_item(sourceDir, items):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
    
    # check if new dir is same as working dir
    if sourceDir == workingDir: return True

    # check if new if new dir is a subfolder of copied item
    for item in items:
        if f"user/{sourceDir}/{item}" == f"user/{workingDir}":
            return {"alrt" : "Destination is a subdirectory of a selected item",
                    "alrttyp" : "alert"}
    
    isDir = os.path.isdir
    isFile = os.path.isfile
    cpyDir = shutil.copytree
    cpyFile = shutil.copyfile

    for item in items:

        itemPath = f"user/{sourceDir}/{item}"
        newPath = f"user/{workingDir}/{item}"

        # folders
        if isDir(newPath):
            return {"alrt" : "Item already exist",
                    "alrttyp" : "alert"}
        
        elif isDir(itemPath): cpyDir(itemPath, newPath)
        
        # files
        if isFile(newPath):
            return {"alrt" : "Item already exist",
                    "alrttyp" : "alert"}
        
        elif isFile(itemPath): cpyFile(itemPath, newPath)

    return True

def move_item(sourceDir, items):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
    
    # check if new dir is same as working dir
    if sourceDir == workingDir: return True
    
    # check if new if new dir is a subfolder of copied item
    for item in items:
        if f"user/{sourceDir}/{item}" == f"user/{workingDir}":
            return {"alrt" : "Destination is a subdirectory of a selected item",
                    "alrttyp" : "alert"}

    isDir = os.path.isdir
    isFile = os.path.isfile
    mov = shutil.move

    for item in items:

        itemPath = f"user/{sourceDir}/{item}"
        newPath = f"user/{workingDir}/{item}"

        if isDir(newPath) or isFile(newPath):
            return {"alrt" : "Item already exist",
                    "alrttyp" : "alert"}

        mov(itemPath, newPath)

    return True

def rename_item(itemName, newName):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))
    
    # check if item with new name exists
    if os.path.isdir(f"user/{workingDir}/{newName}") or \
        os.path.isfile(f"user/{workingDir}/{newName}"):
        return {"alrt" : "Name is already taken",
                "alrttyp" : "alert"}

    os.rename(f"user/{workingDir}/{itemName}", f"user/{workingDir}/{newName}")
    
    return True

def delete_item(items):

    workingDir = "/".join(utils.get_config("filemanager", "DIR_SEQUENCE"))

    isDir = os.path.isdir
    delDir = shutil.rmtree
    isFile = os.path.isfile
    delFile = os.remove

    chMod = os.chmod
    
    for item in items:

        itemPath = f"user/{workingDir}/{item}"
        chMod(itemPath, 0o777)

        # folders
        if isDir(itemPath): delDir(itemPath)
        
        # files
        elif isFile(itemPath): delFile(itemPath)

    return True


def upload_file(files, workingDir):

    fileName = secure_filename(files.filename)

    # format filename
    tempName = fileName
    nameNumber = 2

    while True:

        if (os.path.isfile(f"user/{workingDir}/{tempName}")):

            tempName, fileExtension = utils.seperate_filename(fileName)
            tempName = tempName + f"({nameNumber})." + fileExtension

            nameNumber += 1

            continue

        fileName = tempName

        break
    
    try:
        
        files.save(f"user/{workingDir}/{fileName}")

        return True

    except Exception as e:

        return {"alrt" : e,
                "alrttyp" : "error"}