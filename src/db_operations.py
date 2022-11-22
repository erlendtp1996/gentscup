from common.env import read_env_vars
from db.db_connector import create_schema
import os


read_env_vars()
create_schema()
