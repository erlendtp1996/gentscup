import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CupDetails({ updateSelectedCup, claims }) {
  const [cupComponentList, setCupComponentList] = useState([])
  const [cups, setCups] = useState([])
  const [selectedCup, setSelectedCup] = useState({})

  // Cup state
  const [showNewCup, setShowNewCup] = useState(false);
  const [cupLocation, setCupLocation] = useState("");
  const [cupYear, setCupYear] = useState("");
  const [cupDescription, setCupDescription] = useState("");
  const handleCloseNewCup = () => setShowNewCup(false);
  const handleShowNewCup = () => setShowNewCup(true);
  const handleSaveNewCup = () => {
    createCup(() => setShowNewCup(false));
  }

  function listCups() {
    fetch("/api/cups", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setCups(data)

        const cupItems = [(<option value="0" key="0">Select a Gents Cup</option>)];
        cupItems.push(data.map((cupItem) =>
          <option value={cupItem.id.toString()} key={cupItem.id.toString()}>
            {cupItem.year}: {cupItem.location}
          </option>
        ));

        setCupComponentList(cupItems);
      })
      .catch((error) => console.log(error));
  }

  function createCup(callback) {
    fetch("/api/cups", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "year": cupYear,
        "location": cupLocation,
        "description": cupDescription
      })
    }).then((response) => response.json())
      .then((data) => {
        callback()
        listCups()
      })
      .catch((error) => console.log(error));
  }

  const onChangeCup = (data) => {
    let selectedCupObject = cups.filter(obj => obj.id == data.nativeEvent.target.value)[0]
    setSelectedCup(selectedCupObject);
    updateSelectedCup(selectedCupObject);
  }

  //selected cup effect, should re-render on lo
  useEffect(() => {
    listCups()
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={4}>
          <Form.Select aria-label="Select Cup" onChange={onChangeCup}>
            {cupComponentList}
          </Form.Select>
        </Col>
        <Col style={{ 'display': 'flex', 'justifyContent': 'end' }}>
          {claims && claims['cognito:groups'].includes('commissioner') &&
            <Button variant="primary" onClick={handleShowNewCup}>
              Add new Gents Cup
            </Button>
          }
          <Modal show={showNewCup} onHide={handleCloseNewCup}>
            <Modal.Header closeButton>
              <Modal.Title>Add new Gents Cup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter location" onChange={(e) => setCupLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control type="text" placeholder="Enter year" onChange={(e) => setCupYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" placeholder="Enter year" onChange={(e) => setCupDescription(e.target.value)} />
                </Form.Group>
              </Form>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseNewCup}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSaveNewCup} disabled={!((cupYear && cupYear.length > 0) && (cupLocation && cupLocation.length > 0) && (cupDescription && cupDescription.length > 0))}>
                Create New Cup
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container >
  )
}