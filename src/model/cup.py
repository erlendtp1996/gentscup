from dataclasses import dataclass

@dataclass
class Cup:
    year: str
    description: str
    location: str
    id: int = 0
    

    def isValidForInsert(self):
        return (self.year is not None and
            self.description is not None and
            self.location is not None)
    
"""
BELOW ARE CUP OPERATIONS
"""
#should adhear to table structure & needs to move to data class
def map_cup_record(record):
    return Cup(id=record[0], year=record[1], description=record[2], location=record[3])


# Service Methods
def create_cup_entry(Cup, Database):
    record = Database.insert('INSERT INTO cup (year, description, location) VALUES (%s, %s, %s) RETURNING cupId, year, description, location;', (Cup.year, Cup.description, Cup.location), True)
    Cup.id = record[0]

def list_cups(Database):
    records = fetch_all("SELECT cupId, year, description, location FROM cup;")
    records = list(map(map_cup_record, records))
    return records

def get_single_cup(Cup, Database):
    return None