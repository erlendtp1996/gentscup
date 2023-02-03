import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Team from './Team'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function TeamDashboard({ selectedCup, playerList, captainList, claims }) {
    const [cupTeams, setCupTeams] = useState([])
    const [captainUserSelectList, setCaptainUserSelectList] = useState([])

    // Team State
    const [showNewTeam, setShowNewTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [totalNumberOfBullets, setTotalNumberOfBullets] = useState("");
    const [captain, setTeamCaptain] = useState({});
    const handleCloseNewTeam = () => setShowNewTeam(false);
    const handleShowNewTeam = () => setShowNewTeam(true);
    const handleSaveNewTeam = () => {
        createTeam(() => setShowNewTeam(false))
    }

    function getTeams(id) {
        fetch(`/api/cups/${id}/cupTeams`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((data) => {
                setCupTeams(data)
            })
            .catch((error) => console.log(error));
    }

    function createTeam(callback) {
        fetch(`/api/cups/${selectedCup.id}/cupTeams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": teamName,
                "captainUser": captain.username,
                "captainEmail": captain.email,
                "teamNumberOfBullets": totalNumberOfBullets
            })
        }).then((response) => response.json())
            .then((data) => {
                callback()
                getTeams(selectedCup.id)
            })
            .catch((error) => console.log(error));
    }

    function updateTeamMembers({ cupTeamId, teamMembers }) {
        return fetch(`/api/cups/${selectedCup.id}/cupTeams/${cupTeamId}/teamMembers`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamMembers)
        })
    }

    // effects
    useEffect(() => {
        if (selectedCup && selectedCup.id) {
            getTeams(selectedCup.id)
        }
    }, [selectedCup]);

    useEffect(() => {
        if (captainList && captainList.length > 0) {
            const selectList = [(<option value="0" key="0">Select a Captain</option>)];
            selectList.push(captainList.map((captain) =>
                <option value={captain.email} key={captain.email}>
                    {captain.username} - {captain.email}
                </option>
            ));
            setCaptainUserSelectList(selectList)
        }
    }, [captainList])

    return (
        <Container>
            <Row>
                <Col style={{ 'display': 'flex', 'justifyContent': 'end' }}>
                    {claims && claims['cognito:groups'].includes('commissioner') &&
                        <Button variant="primary" onClick={handleShowNewTeam} disabled={selectedCup && (selectedCup.id == 'undefined' || selectedCup.id == null)}>
                            Add new Team
                        </Button>
                    }
                    <Modal show={showNewTeam} onHide={handleCloseNewTeam}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add new Team</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="formTeamName">
                                <Form.Label>Team Name:</Form.Label>
                                <Form.Control type="text" placeholder="Enter team name" onChange={(e) => setTeamName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formTotalNumberOfBullets">
                                <Form.Label>Total Number of Bullets</Form.Label>
                                <Form.Control type="text" placeholder="Enter total number of bullets" onChange={(e) => setTotalNumberOfBullets(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCaptain">
                                <Form.Label>Captain</Form.Label>
                                <Form.Select aria-label="Select Captain" onChange={(e) => setTeamCaptain(captainList.filter(c => c.email == e.target.value)[0])}>
                                    {captainUserSelectList}
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseNewTeam}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveNewTeam}>
                                Create New Team
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>

            <Row xs={1} md={2} className="g-4" style={{ 'marginTop': '3%' }}>
                {cupTeams.map((team) => <Col key={"parentTeamCol-" + team.cupTeamId.toString()}><Team key={team.cupTeamId.toString()} team={team} playerList={playerList} updateTeamMembers={(obj) => updateTeamMembers(obj)} /></Col>)}
            </Row>
        </Container>
    )
}
