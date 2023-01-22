import psycopg2
import os

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(dbname=os.environ["DB_NAME"], user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])
        self.cur = self.conn.cursor()

    def query(self, query):
        self.cur.execute(query)

    def insert(self, command, values=None, with_return=False):
        record = None
        self.cur.execute(command, values)
        if with_return:
            record = self.cur.fetchone()
        self.conn.commit()
        return record
    
    def fetch_all(self, command, values=None):
        self.cur.execute(command, values)
        record = self.cur.fetchall()
        self.conn.commit()
        return record

    def fetch_one(self, command, values=None):
        self.cur.execute(command, values)
        record = self.cur.fetchone()
        self.conn.commit()
        return record

    def close(self):
        self.cur.close()
        self.conn.close()

# WILL DROP & RE-CREATE TABLES
def create_schema(): 
    File_object = open("src/integrations/create_schema.txt", "r")
    operation = File_object.read()
    File_object.close()
    conn = psycopg2.connect(dbname=os.environ["DB_NAME"], user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])
    cur = conn.cursor()
    cur.execute(operation)
    conn.commit()
    cur.close()
    conn.close()
    print("Done")

"""

FOR FUTURE REFERECE - NEED TO CLEAN UP

def get_users():
    # Connect to an existing database
    conn = psycopg2.connect(dbname=os.environ["DB_NAME"], user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a command: this creates a new table
    #cur.execute("CREATE TABLE player (id serial PRIMARY KEY, name text, handicap integer, personal_info text, role text);")

    # Pass data to fill a query placeholders and let Psycopg perform
    # the correct conversion (no more SQL injections!)
    # cur.execute("INSERT INTO player (name, handicap, personal_info, role) VALUES (%s, %s, %s, %s)", ("Thomas Erlendson", 20, "A player in the cup tournament", "Player"))

    # Query the database and obtain data as Python objects
    cur.execute("SELECT * FROM player;")
    player = cur.fetchone()

    # Make the changes to the database persistent
    conn.commit()

    # Close communication with the database
    cur.close()
    conn.close()
    return player
"""