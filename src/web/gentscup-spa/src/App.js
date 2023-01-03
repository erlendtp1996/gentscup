import './App.css';
import GentsCupHeader from './components/GentsCupHeader';
import CupDetails from './components/CupDetails';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React, { useState } from 'react';

function App() {
  const TOKEN_KEY = "GC_TOKEN"
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const queryParams = new URLSearchParams(window.location.search);
  const [claims, setClaims] = useState(false)

  // fetches the access token
  function getAccessToken(code, state) {
    return fetch("/api/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "code": code, "state": state })
    }).then((response) => response.json())
      .then((data) => {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        getClaims();
      });
  }

  //fetches the user claims
  function getClaims() {
    fetch("/api/me", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      }
    }).then((response) => response.json())
      .then((data) => {
        setClaims(data.claims);
      });
  }

  //if no user claims in application state & we have access token, then load claims
  if (!claims && accessToken && accessToken.length > 0) {
    getClaims();
  //if no user claims & no accessToken in local state, try accessing query parameters
  } else if (!claims && queryParams.has("code") && queryParams.has("state")) {
    getAccessToken(queryParams.get("code"), queryParams.get("state"));
  }

  return (
    <div className="App">
      <Container>
        <GentsCupHeader claims={claims} />
        <Row>
          <CupDetails />
        </Row>
      </Container>
    </div>
  );
}
export default App;