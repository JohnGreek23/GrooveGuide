import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

function MusicApp() {
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [events, setEvents] = useState([]);
  const [latlong, setLatLong] = useState('');

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleArtistChange = (e) => {
    setArtist(e.target.value);
  };

  const resetInputs = () => {
    setGenre('');
    setArtist('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLatLong(`${latitude},${longitude}`);
        fetchRecommendedEvents(artist || genre, `${latitude},${longitude}`);
      });
    }
  };

  const fetchRecommendedEvents = (keyword, location) => {
    const apiKey = 'pKiE2zYyc7KexxDyMtquVIRjuChhCFzo';

    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyword}&apikey=${apiKey}&latlong=${location}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data?._embedded?.events || []);
        resetInputs(); // Reset inputs when results load
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setEvents([]); // Clear events in case of an error
      });
  };

  return (
    <Container className="music-app" style={{ marginTop: '50px', textAlign: 'center', backgroundColor: '#343a40', color: 'white', padding: '20px' }}>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="genre">
              <Form.Label>Pick a genre</Form.Label>
              <Form.Control as="select" value={genre} onChange={handleGenreChange}>
                <option value="">Select Genre</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="country">Country</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="artist">
              <Form.Label>Or search for an artist</Form.Label>
              <Form.Control type="text" value={artist} onChange={handleArtistChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Go
            </Button>
          </Form>
        </Col>
      </Row>

      <Tabs style={{ marginTop: '20px' }}>
        <TabList>
          <Tab>Recommended Artists</Tab>
          <Tab>Recommended Events</Tab>
        </TabList>

        <TabPanel>
          <p>No results found for artists.</p>
        </TabPanel>

        <TabPanel>
          {events.length === 0 && <p>No results found for events.</p>}
          {events.map((event) => (
            <Card key={event.id} style={{ margin: '10px', display: 'flex', alignItems: 'center' }}>

              <Card.Img src={event.images[0]?.url} alt="Event" style={{ maxWidth: '200px', minWidth: '200px', objectFit: 'cover' }} />

              <Card.Body style={{ marginLeft: '10px' }}>
                <Card.Title>
                  <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    {event.name}
                  </a>
                </Card.Title>
                <Card.Text>
                  <b>Where:</b> {event._embedded?.venues[0]?.name || 'Not available'}
                  <br />
                  <b>When:</b> {event.dates?.start?.localDate || 'Not available'} {event.dates?.start?.localTime || 'Not available'}

                  {/* other event information */}

                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </TabPanel>
      </Tabs>
    </Container>
  );
}

export default MusicApp;
