import './App.css';
import GentsCupHeader from './components/GentsCupHeader';
import CupDetails from './components/common/CupDetails';
import CaptainDashboard from './components/captain/CaptainDashboard';
import CommissionerDashboard from './components/commissioner/CommissionerDashboard';
import PlayerDashboard from './components/player/PlayerDashboard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React, { useState } from 'react';

function App() {
  const TOKEN_KEY = "GC_TOKEN"

  const [claims, setClaims] = useState(false)
  const [groups, setGroups] = useState([])
  const [signedIn , setSignedIn] = useState(false)

  //fetches the user claims
  function getClaims() {
    fetch("/api/me", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setClaims(data.claims);
        setGroups(data.claims['cognito:groups']);
        setSignedIn(true);
      })
      .catch((error) => {
        //need to catch this & if 401 then setSignedIn(false)
      });
  }

  //if no user claims in application state & we have access token, then load claims
  if (!claims) {
    getClaims();
  }

  return (
    <div className="App">
      <Container>
        <GentsCupHeader claims={claims} />
        <Row>
          <CupDetails />
        </Row>
        { groups && groups.includes("commissioner") && <Row><CommissionerDashboard claims={claims}/></Row>}
        { groups && groups.includes("captain") && <Row><CaptainDashboard claims={claims}/></Row>}
        { groups && groups.includes("player") && <Row><PlayerDashboard claims={claims}/></Row>}
      </Container>
    </div>
  );
}
export default App;