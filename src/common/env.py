import os

def read_env_vars():
    File_object = open(".env", "r")
    lines = File_object.readlines()
    for line in lines:
        var = line.split("=")
        os.environ[var[0]] = var[1].strip()
    File_object.close()