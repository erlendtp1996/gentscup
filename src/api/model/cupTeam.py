from dataclasses import dataclass, field

"""
    cupTeamId serial PRIMARY KEY,
    cupId integer REFERENCES cup,
    name text,
    captainUser text,
    captainEmail text,
    teamNumberOfBullets integer
"""
@dataclass
class CupTeam:
    cupId: int
    name: str
    captainUser: str
    captainEmail: str
    teamNumberOfBullets: int
    cupTeamId: int = 0
    cupTeamMembers: list = field(default_factory=list)
    
    def isValidForInsert(self):
        return (self.cupId is not None and
            self.name is not None and
            self.captainUser is not None and
            self.captainEmail is not None and
            self.teamNumberOfBullets is not None)

@dataclass
class CupTeamMember:
    userName: str
    userEmail: str
    cupTeamId: int
    individualNumberOfBullets: int = 0
    isCaptain: bool = False
    cupTeamMemberId: int = 0
    
    def isValidForInsert(self):
        return (self.userName is not None and
            self.userEmail is not None and
            self.cupTeamId is not None)


def valid_num_of_captains(cupTeamMemberList):
    captains = filter(lambda x: x.isCaptain, cupTeamMemberList)
    return len(list(captains)) == 1

def map_cup_team_member(record):
    return CupTeamMember(cupTeamMemberId=record[0], userName=record[1], userEmail=record[2], cupTeamId=record[3], individualNumberOfBullets=record[4], isCaptain=record[5])

"""
BELOW ARE TEAM OPERATIONS
"""
# Service Methods
def create_cup_team_entry(CupTeam, Database):
    #Create Team
    insert_cup_team(CupTeam, Database)

    #Assign Captain
    captain = CupTeamMember(userName=CupTeam.captainUser, userEmail=CupTeam.captainEmail, cupTeamId=CupTeam.cupTeamId, isCaptain=True)
    insert_cup_team_member(captain, Database)

    #Add Captain to team for response
    CupTeam.cupTeamMembers.append(captain)

def put_cup_team_members(cupTeamMemberList, Database):
    insertValues = []
    updateValues = []

    for member in cupTeamMemberList:
        if member.cupTeamMemberId > 0:
            updateValues.append((member.cupTeamMemberId, member.userName, member.userEmail, member.individualNumberOfBullets, member.isCaptain))
        else:
            insertValues.append((member.userName, member.userEmail, member.cupTeamId, member.individualNumberOfBullets, member.isCaptain,))

    if len(insertValues)>0:
        insertValues = insert_cup_team_members(insertValues, Database)
    
    if len(updateValues)>0:
        updateValues = update_cup_team_members(updateValues, Database)

    insertValues.extend(updateValues)
    insertValues.sort(key=lambda x: x.cupTeamMemberId)

    return insertValues

def insert_cup_team(CupTeam, Database):
    record = Database.insert('INSERT INTO cupTeam (cupId, name, captainUser, captainEmail, teamNumberOfBullets) VALUES (%s, %s, %s, %s, %s) RETURNING cupTeamId;', (CupTeam.cupId, CupTeam.name, CupTeam.captainUser, CupTeam.captainEmail, CupTeam.teamNumberOfBullets), True)
    CupTeam.cupTeamId = record[0]

def insert_cup_team_member(CupTeamMember, Database):
    record = Database.insert('INSERT INTO cupTeamMember (userName, userEmail, cupTeamId, individualNumberOfBullets, isCaptain) VALUES (%s, %s, %s, %s, %s) RETURNING cupTeamMemberId;', (CupTeamMember.userName, CupTeamMember.userEmail, CupTeamMember.cupTeamId, CupTeamMember.individualNumberOfBullets, CupTeamMember.isCaptain), True)
    CupTeamMember.cupTeamMemberId = record[0]

def insert_cup_team_members(insertValues, Database):
    command = "INSERT INTO cupTeamMember (userName, userEmail, cupTeamId, individualNumberOfBullets, isCaptain) VALUES "
    mapString = "(%s, %s, %s, %s, %s)"
    endingString = " RETURNING cupTeamMemberId, userName, userEmail, cupTeamId, individualNumberOfBullets, isCaptain;"
    
    records = Database.insert_many(command=command, values=insertValues, mapString=mapString, endingString=endingString)
    return list(map(map_cup_team_member, records))

def update_cup_team_members(updateValues, Database):
    command = """UPDATE cupTeamMember AS t 
                    SET userName = u.userName,
                    userEmail = u.userEmail,
                    individualNumberOfBullets = u.individualNumberOfBullets,
                    isCaptain = u.isCaptain
                    FROM (VALUES %s) AS u(cupTeamMemberId, userName, userEmail, individualNumberOfBullets, isCaptain) 
                    WHERE u.cupTeamMemberId = t.cupTeamMemberId 
                    RETURNING t.cupTeamMemberId, t.userName, t.userEmail, t.cupTeamId, t.individualNumberOfBullets, t.isCaptain;"""
    
    records = Database.update_many(command=command, values=updateValues, fetch=True)    
    return list(map(map_cup_team_member, records))

    

