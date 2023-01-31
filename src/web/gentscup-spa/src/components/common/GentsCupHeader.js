import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'

/**
 * TO DO: 
 * Add logout button
 *    On logout, clear the access token & navigate user to log out url
 */

export default function GentsCupHeader({ claims }) {
  const isSignedIn = (claims || false);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          Gents Cups
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          { isSignedIn && <Navbar.Text> Signed in as: {claims.username} </Navbar.Text>}
          { !isSignedIn && <Button variant="light" href="/api/sign_in">Sign In</Button>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}