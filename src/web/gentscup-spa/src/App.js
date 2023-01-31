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
  const [groups, setGroups] = useState([])
  const [signedIn, setSignedIn] = useState(false)
  const [selectedCup, setSelectedCup] = useState({})
  const [userList, setUserList] = useState([])
  const [captainUserList, setCaptainUserList] = useState([])
  


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
      .catch((error) => {
        //need to catch this & if 401 then setSignedIn(false)
      });
  }

  //selected cup effect
  useEffect(() => {
    getUsers()
    getClaims()
  }, []); 

  return (
    <div className="App">
      <GentsCupHeader claims={claims} />
      <Container>
        <Stack gap={5} style={{'marginTop': '3%'}}>
          <Row>
            <CupDetails updateSelectedCup={(cup) => setSelectedCup(cup)} />
          </Row>
          <Row>
            <TeamDashboard selectedCup={selectedCup} playerList={userList} captainList={captainUserList}/>
          </Row>
        </Stack>
      </Container>
    </div >
  );
}
export default App;