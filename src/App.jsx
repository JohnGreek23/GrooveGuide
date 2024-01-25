import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import logo from './images/music-notes.png';
import jumbobanner from './images/jumbobanner.png';


function MusicApp() {
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [events, setEvents] = useState([]);
  const [latlong, setLatLong] = useState('');
  const [artists, setArtists] = useState([]);


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
        fetchRecommendedArtists(artist || genre);
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

  const fetchRecommendedArtists = (keyword) => {
    const lastFmApiKey = '0fc8b422278de689fe5ad13e0b059af2';
  
    axios
      .get(`http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=${keyword}&api_key=${lastFmApiKey}&format=json`)
      .then((response) => {
        const similarArtistsData = response.data?.similarartists?.artist || [];

        // Fetch detailed information for each artist
        const promises = similarArtistsData.map((similarArtist) =>
          axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(similarArtist.name)}&api_key=${lastFmApiKey}&format=json`)
        );

        // Wait for all promises to resolve
        Promise.all(promises)
          .then((detailedResponses) => {
            const detailedArtistsData = detailedResponses.map((detailedResponse) => detailedResponse.data.artist);
            setArtists(detailedArtistsData);
            resetInputs(); // Reset inputs when results load
          })
          .catch((error) => {
            console.error('Error fetching detailed artist information:', error);
            setArtists([]); // Clear artists in case of an error
          });
      })
      .catch((error) => {
        console.error('Error fetching similar artists:', error);
        setArtists([]); // Clear artists in case of an error
      });
  };
  

  return (
    <div>
    <nav className="navbar bg-body-tertiary" >
            <div className="container-fluid">
                <a className="navbar-brand"  style={{fontSize: '40px'}}>
                    <img src={logo} alt="Logo"  className="logo" style={{width: '60px', height: '60px', marginRight: '25px', verticalAlign: 'middle'}}/>GrooveGuide
                </a>
            </div>
    </nav>
    <div>
            <div className="jumbotron" style={{textAlign: 'center', marginTop: '50px'}}>
                <h1 className="display-4">Your Gateway to Limitless Discovery!</h1>
                <p>Your next favourite artist and unforgettable live experience are just a tap away.</p>
            </div>
        </div>
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
          {artists.length === 0 ? (
            <p>No results found for artists.</p>
          ) : (
            artists.map((artist, index) => (
              <Card key={`artist_${index}`} style={{ margin: '10px', display: 'flex', alignItems: 'center' }}>
                <Card.Img
                  src={artist.image[2]?.['#text']}
                  alt="Artist"
                  style={{ maxWidth: '200px', minWidth: '200px', objectFit: 'cover' }}
                />
                <Card.Body style={{ marginLeft: '10px' }}>
                  <Card.Title>
                    <a href={artist.url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                      {artist.name}
                    </a>
                  </Card.Title>
                  <Card.Text>{artist.bio?.summary || 'No information available.'}</Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
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
    </div>
  );
}

export default MusicApp;