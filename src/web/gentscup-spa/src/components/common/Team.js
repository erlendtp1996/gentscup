import React, { useState, useEffect } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

const columns = [{ name: 'userName', header: 'Player' }, { name: 'individualNumberOfBullets', header: '# of Bullets', type: 'number', editable: true }]

export default function Team({ team, playerList }) {
    const [teamData, setTeamData] = useState(team);
    const [teamMembers, setTeamMembers] = useState(team.cupTeamMembers)
    const [newPlayer, setNewPlayer] = useState("");
    const [newIndividualNumberOfBullets, setNewIndividualNumberOfBullets] = useState(0);
    const [playerComponentDropdownValues, setPlayerComponentDropdownValues] = useState([])

    const handleAddNewPlayer = () => {
        setTeamMembers(teamMembers.concat([{
            "cupTeamId": team.cupTeamId,
            "individualNumberOfBullets": newIndividualNumberOfBullets,
            "userEmail": newPlayer.email,
            "userName": newPlayer.username
        }]));
        setNewIndividualNumberOfBullets(0);
        setNewPlayer("")
        //ReactDOM.findDOMNode(this.messageForm).reset();
    }
    const handleSaveTeam = () => {
        // TODO ADD NEW PLAYER TO TEAM
    }

    /*
    const onEditComplete = useCallback(({ value, columnId, rowId }) => {
        const data = [...teamData.cupTeamMembers];
        data[rowId] = Object.assign({}, data[rowId], { [columnId]: value })

        setTeamMemberData(data);
        onEditComplete={onEditComplete}
    }, [teamMemberData])
    */

    useEffect(() => {
        setTeamData(team)
    }, [team]);

    useEffect(() => {
        if ((playerList && playerList.length > 0) && (teamData && teamData.cupTeamId)) {
            const playerSelectList = [(<option value="0" key={`${teamData.cupTeamId}-0`}>Select a Player</option>)];
            playerSelectList.push(playerList.map((player) =>
                <option value={player.email} key={`${teamData.cupTeamId}-` + player.email}>
                    {player.username} - {player.email}
                </option>
            ));
            setPlayerComponentDropdownValues(playerSelectList)
        }
    }, [playerList, teamData])

    return (
        <Card bg="light" className="mb-2">
            <Card.Body>
            <Card.Header>
            <Card.Title>{teamData.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Captain: {teamData.captainUser}</Card.Subtitle>
            </Card.Header>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formPlayer">
                            <Form.Label>Player</Form.Label>
                            <Form.Select aria-label="Select Player" onChange={(e) => {
                                console.log(playerList, e.target.value)
                                setNewPlayer(playerList.filter(c => c.email == e.target.value)[0])
                            }}>
                                {playerComponentDropdownValues}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formIndividualNumberOfBullets">
                            <Form.Label># Bullets</Form.Label>
                            <Form.Control type="text" placeholder="# Bullets" onChange={(e) => setNewIndividualNumberOfBullets(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'end'}}>
                        <Button variant="primary" onClick={handleAddNewPlayer} >
                            Add Player
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
            <ReactDataGrid
                idProperty="id"
                columns={columns}
                dataSource={teamMembers} />
            <Card.Footer>
                <Row>
                    <Col>
                    </Col>
                    <Col style={{ 'display': 'flex', 'justifyContent': 'end' }}>
                        <Button variant="success" onClick={handleSaveTeam} >
                            Save Team
                        </Button>
                    </Col>
                </Row>
            </Card.Footer>
        </Card >
    )
}