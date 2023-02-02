import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Team from './Team'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function TeamDashboard({ selectedCup, playerList, captainList }) {
    const [cupTeams, setCupTeams] = useState([])

    const captainUserSelectList = [(<option value="0" key="0">Select a Captain</option>)];
    captainUserSelectList.push(captainList.map((captain) =>
        <option value={captain.email} key={captain.email}>
            {captain.username} - {captain.email}
        </option>
    ));

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
            .catch((error) => {
                //need to catch this & if 401 then setSignedIn(false)
            });
    }

    // TODO - need to get the payload from postmand and embed the cupId from the inputted cup property
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
            })
            .catch((error) => {
                //need to catch this & if 401 then setSignedIn(false)
            });
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

    // selected cup effect
    useEffect(() => {
        if (selectedCup && selectedCup.id) {
            getTeams(selectedCup.id)
        }
    }, [selectedCup]);

    return (
        <Container>
            <Row>
                <Col>
                    <Button variant="primary" onClick={handleShowNewTeam} disabled={selectedCup && (selectedCup.id == 'undefined' || selectedCup.id == null)}>
                        Add new Team
                    </Button>

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

            <Row xs={1} md={2} className="g-4">
                {cupTeams.map((team) => <Col key={"parentTeamCol-" + team.cupTeamId.toString()}><Team key={team.cupTeamId.toString()} team={team} playerList={playerList} updateTeamMembers={(obj) => updateTeamMembers(obj)} /></Col>)}
            </Row>
        </Container>
    )
}
