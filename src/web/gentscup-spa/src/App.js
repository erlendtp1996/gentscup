import './App.css';
import GentsCupHeader from './components/common/GentsCupHeader';
import CupDetails from './components/common/CupDetails';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import React, { useEffect, useState } from 'react';
import TeamDashboard from './components/common/TeamDashboard';
import '@inovua/reactdatagrid-community/index.css'
import Stack from 'react-bootstrap/Stack'

function App() {
  const [claims, setClaims] = useState(false)
  const [selectedCup, setSelectedCup] = useState({})
  const [userList, setUserList] = useState([])
  const [captainUserList, setCaptainUserList] = useState([])
  const [isSignedIn, setIsSignedIn] = useState(false)

  //fetches the user claims
  function getClaims() {
    fetch("/api/me", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setIsSignedIn(true)
        setClaims(data.claims);
      })
      .catch((error) => setIsSignedIn(false));
  }

  function getUsers() {
    fetch("/api/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => response.json())
      .then((data) => {
        setUserList(data)
        let captains = data.filter((user) => {
          return user.groups.includes("captain");
        });
        setCaptainUserList(captains)
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getUsers()
    getClaims()
  }, []);

  const getDashboard = () => {
    return (
      <Stack gap={5} style={{ 'marginTop': '3%' }}>
        <Row>
          <CupDetails updateSelectedCup={(cup) => setSelectedCup(cup)} claims={claims} />
        </Row>
        <Row>
          <TeamDashboard selectedCup={selectedCup} playerList={userList} captainList={captainUserList} claims={claims} />
        </Row>
      </Stack>)
  }

  const getSignInScreen = () => {
    return (
      <Row style={{ 'marginTop': '20%' }}>
        <h3>Please sign in</h3>
      </Row>
    )
  }

  return (
    <div className="App">
      <GentsCupHeader claims={claims} />
      <Container>
        { isSignedIn && getDashboard() }
        { !isSignedIn && getSignInScreen() }
      </Container>
    </div >
  );
}
export default App;