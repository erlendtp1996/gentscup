from integrations.db import create_schema
from common.env import read_env_vars


read_env_vars()
create_schema()