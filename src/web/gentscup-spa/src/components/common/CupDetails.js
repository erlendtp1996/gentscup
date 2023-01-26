import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function CupDetails({ updateSelectedCup }) {
  const [selectedCup, setSelectedCup] = useState({})
  const [cupComponentList, setCupComponentList] = useState([])
  const [cups, setCups] = useState([])

  //fetches the user claims
  function listCups() {
    fetch("/api/cups", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        data = [{ "id": 2, "year": 2024 }, { "id": 1, "year": 2023 }]
        setCups(data)

        const cupItems = [(<option value="0" key="0">Select a Gents Cup</option>)];
        cupItems.push(data.map((cupItem) =>
          <option value={cupItem.id.toString()} key={cupItem.id.toString()}>
            {cupItem.year}
          </option>
        ));

        setCupComponentList(cupItems);
      })
      .catch((error) => {
        //need to catch this & if 401 then setSignedIn(false)
      });
  }

  const onChangeCup = (data) => {
    console.log(updateSelectedCup)
    let selectedCupObject = cups.filter(obj => obj.id == data.nativeEvent.target.value)[0]
    setSelectedCup(selectedCupObject);
    console.log("From Cup Details", selectedCupObject)
    updateSelectedCup(selectedCupObject);
  }

  if (cupComponentList.length == 0) {
    listCups()
  }

  return (
    <Container>
      <Row>
        <Col xs={4}>
          <Form.Select aria-label="Select Cup" onChange={onChangeCup}>
            {cupComponentList}
          </Form.Select>
        </Col>
        <Col>
          Cup details go here
        </Col>
      </Row>
    </Container>
  )
}