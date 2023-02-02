import psycopg2
import psycopg2.extras
import os

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(dbname=os.environ["DB_NAME"], user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])
        self.cur = self.conn.cursor()

    def query(self, query):
        self.cur.execute(query)
        self.conn.commit()

    def execute(self, command, values):
        self.cur.execute(command, values)
        self.conn.commit()

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

    """
    TODO: Document here:

        args = [(1,2), (3,4), (5,6)]
        args_str = ','.join(cursor.mogrify("%s", (x, )) for x in args)
        cursor.execute("INSERT INTO t (a, b) VALUES "+args_str)
    """
    def insert_many(self, command, values, mapString, endingString=";"):
        args_str = ','.join(self.cur.mogrify(mapString, x).decode('utf-8') for x in values)
        self.cur.execute(command + args_str + endingString)
        records = self.cur.fetchall()
        self.conn.commit()
        return records


    """
    TODO: Document the following: 

    c = db.cursor()
    update_query = UPDATE my_table AS t 
                    SET name = e.name 
                    FROM (VALUES %s) AS e(name, id) 
                    WHERE e.id = t.id;

    psycopg2.extras.execute_values (
        c, update_query, new_values, template=None, page_size=100
    )

    """
    def update_many(self, command, values, template=None, page_size=100, fetch=False):
        records = psycopg2.extras.execute_values (self.cur, command, values, template, page_size, fetch)
        self.conn.commit()
        return records

    def close(self):
        self.cur.close()
        self.conn.close()

# WILL DROP & RE-CREATE TABLES
def create_schema(): 
    File_object = open("src/api/integrations/create_schema.txt", "r")
    operation = File_object.read()
    File_object.close()
    conn = psycopg2.connect(dbname=os.environ["DB_NAME"], user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])
    cur = conn.cursor()
    cur.execute(operation)
    conn.commit()
    cur.close()
    conn.close()
    print("Done")