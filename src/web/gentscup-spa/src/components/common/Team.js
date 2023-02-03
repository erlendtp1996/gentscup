import React, { useState, useEffect, useCallback } from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { BiTrash } from "react-icons/bi";
import Spinner from 'react-bootstrap/Spinner';

export default function Team({ team, playerList, updateTeamMembers }) {
    const [teamData, setTeamData] = useState(team);
    const [teamMembers, setTeamMembers] = useState(team.cupTeamMembers)
    const [newPlayer, setNewPlayer] = useState("");
    const [newIndividualNumberOfBullets, setNewIndividualNumberOfBullets] = useState(0);
    const [playerComponentDropdownValues, setPlayerComponentDropdownValues] = useState([])
    const [displaySaveTeamSpinner, setDisplaySaveTeamSpinner] = useState(false)

    const handleAddNewPlayer = () => {
        const selectedPlayer = playerList.filter(player => player.email == newPlayer)[0];

        setTeamMembers(teamMembers.concat([{
            "cupTeamId": teamData.cupTeamId,
            "individualNumberOfBullets": newIndividualNumberOfBullets,
            "userEmail": selectedPlayer.email,
            "userName": selectedPlayer.username
        }]));
        setNewIndividualNumberOfBullets("");
        setNewPlayer("0")
    }
    const handleSaveTeam = () => {
        setDisplaySaveTeamSpinner(true)
        updateTeamMembers({ "teamMembers": teamMembers, "cupTeamId": team.cupTeamId })
            .then((response) => response.json())
            .then((data) => {
                setDisplaySaveTeamSpinner(false)
                console.log("updated team members!", data);
            })
            .catch((error) => {
                setDisplaySaveTeamSpinner(false)
                console.log("there was an error", error)
            });
    }

    const onEditComplete = useCallback(({ value, columnId, rowIndex, data }) => {
        const newMembers = [...teamMembers]
        newMembers[rowIndex][columnId] = value
        setTeamMembers(newMembers);
    }, [teamMembers])

    const columns = [{
        name: 'userName',
        header: 'Player'
    },
    {
        name: 'individualNumberOfBullets',
        header: '# of Bullets',
        type: 'number', editable: true
    },
    {
        key: "action",
        name: "",
        render: ({ data }) => {
            return (data.isCaptain == true || (data.isCaptain && data.isCaptain.toLowerCase() == 'true')) ? <span></span> : <span style={{ 'display': 'flex', 'justifyContent': 'center', 'cursor': 'pointer' }}><BiTrash id={`${data.cupTeamId}-remove-${data.userEmail}`} onClick={(e) => setTeamMembers(teamMembers.filter(p => p.userEmail != e.target.id.split('-')[2]))} /></span>
        }
    }]

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
                    <Card.Subtitle className="mb-2 text-muted">Captain: {teamData.captainUser} - {teamData.teamNumberOfBullets} Total Bullets</Card.Subtitle>
                </Card.Header>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="formPlayer">
                            <Form.Label>Player</Form.Label>
                            <Form.Select value={newPlayer} aria-label="Select Player" onChange={(e) => { setNewPlayer(e.target.value) }}>
                                {playerComponentDropdownValues}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formIndividualNumberOfBullets">
                            <Form.Label># Bullets</Form.Label>
                            <Form.Control value={newIndividualNumberOfBullets} type="text" placeholder="# Bullets" onChange={(e) => setNewIndividualNumberOfBullets(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'end' }}>
                        <Button variant="primary" onClick={handleAddNewPlayer} >
                            Add Player
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
            <ReactDataGrid
                idProperty="id"
                columns={columns}
                dataSource={teamMembers}
                onEditComplete={onEditComplete} />
            <Card.Footer>
                <Row>
                    <Col>
                    </Col>
                    <Col style={{ 'display': 'flex', 'justifyContent': 'end' }}>
                        {displaySaveTeamSpinner &&
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        }
                        {!displaySaveTeamSpinner &&
                            <Button variant="success" onClick={handleSaveTeam} >
                                Save Team
                            </Button>
                        }
                    </Col>
                </Row>
            </Card.Footer>
        </Card >
    )
}