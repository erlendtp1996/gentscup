from integrations.db import insert, fetch_all

#should adhear to table structure
def map_cup_record(record):
    return {
        "id": record[0],
        "year": record[1]
    }

#test valid inputs & it returns a response
def create_cup_entry(year):
    # need to validate json
    if year is None or len(year) == 0:
        raise Exception("Bad Request")

    # execute command with a RETURNING to fetch the row
    record = insert("INSERT INTO cup (year) VALUES ({0}) RETURNING cupId, year;".format(year), True)
    record = map_cup_record(record)
    return record

def list_cups():
    records = fetch_all("SELECT cupId, year FROM cup;")
    records = list(map(map_cup_record, records))
    return records

def get_single_cup(id):
    return None