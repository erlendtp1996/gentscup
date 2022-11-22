import psycopg2
import os


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