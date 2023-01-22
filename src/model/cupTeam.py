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
    cupTeamId: str
    individualNumberOfBullets: int = 0
    isCaptain: bool = False
    cupTeamMemberId: int = 0
    
    def isValidForInsert(self):
        return (self.userName is not None and
            self.userEmail is not None and
            self.cupTeamId is not None)

"""
BELOW ARE CUP OPERATIONS
"""
# Service Methods
def create_cup_team_entry(CupTeam, Database):
    #Create team
    record = Database.insert('INSERT INTO cupTeam (cupId, name, captainUser, captainEmail, teamNumberOfBullets) VALUES (%s, %s, %s, %s, %s) RETURNING cupTeamId;', (CupTeam.cupId, CupTeam.name, CupTeam.captainUser, CupTeam.captainEmail, CupTeam.teamNumberOfBullets), True)
    CupTeam.cupTeamId = record[0]
    
    #Insert Captain
    record = Database.insert('INSERT INTO cupTeamMember (userName, userEmail, cupTeamId, isCaptain) VALUES (%s, %s, %s, %s) RETURNING cupTeamMemberId;', (CupTeam.captainUser, CupTeam.captainEmail, CupTeam.cupTeamId, "TRUE"), True)
    captain = CupTeamMember(cupTeamMemberId=record[0], userName=CupTeam.captainUser, userEmail=CupTeam.captainEmail, cupTeamId=CupTeam.cupTeamId, isCaptain=True)
    CupTeam.cupTeamMembers.append(captain)

def create_cup_team_member_entry(CupTeamMember, Database):
    record = Database.insert('INSERT INTO cupTeamMember (userName, userEmail, cupTeamId, isCaptain) VALUES (%s, %s, %s, %s) RETURNING cupTeamMemberId;', (CupTeamMember.userName, CupTeamMember.userEmail, CupTeamMember.cupTeamId, CupTeamMember.isCaptain, CupTeamMember.individualNumberOfBullets), True)
    CupTeamMember.cupTeamMemberId = record[0]
