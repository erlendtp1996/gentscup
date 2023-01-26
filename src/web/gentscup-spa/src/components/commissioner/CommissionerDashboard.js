import React, { useState } from 'react';
import CupDetails from '../common/CupDetails'
import Row from 'react-bootstrap/esm/Row'
import Container from 'react-bootstrap/esm/Container'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'

export default function CommissionerDashboard({ cup, captainList }) {

  const [showNewCup, setShowNewCup] = useState(false);
  const [showNewTeam, setShowNewTeam] = useState(false);

  const handleCloseNewCup = () => setShowNewCup(false);
  const handleShowNewCup = () => setShowNewCup(true);

  const handleCloseNewTeam = () => setShowNewTeam(false);
  const handleShowNewTeam = () => setShowNewTeam(true);

  return (
    <Container>
      <Row>
        <Col>Selected Cup: {cup.id}</Col>
        <Col>
          <Button variant="primary" onClick={handleShowNewCup}>
            Add new Gents Cup
          </Button>

          <Modal show={showNewCup} onHide={handleCloseNewCup}>
            <Modal.Header closeButton>
              <Modal.Title>Add new Gents Cup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter location" onChange={(e) => console.log(e)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control type="text" placeholder="Enter year" onChange={(e) => console.log(e)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" placeholder="Enter year" onChange={(e) => console.log(e)} />
                </Form.Group>
              </Form>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseNewCup}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCloseNewCup}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleShowNewTeam}>
            Add new Team
          </Button>

          <Modal show={showNewTeam} onHide={handleCloseNewTeam}>
            <Modal.Header closeButton>
              <Modal.Title>Add new Team</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formTeamName">
                <Form.Label>Team Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter team name" onChange={(e) => console.log(e)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTotalNumberOfBullets">
                <Form.Label>Total Number of Bullets</Form.Label>
                <Form.Control type="text" placeholder="Enter total number of bullets" onChange={(e) => console.log(e)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCaptain">
                <Form.Label>Captain</Form.Label>
                <Form.Select aria-label="Select Captain" onChange={(e) => console.log(e)}>
                  {[]}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseNewTeam}>
                Close
              </Button>
              <Button variant="primary" onClick={handleCloseNewTeam}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>

  )
}
