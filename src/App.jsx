import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Form, Button } from 'react-bootstrap';

function MusicApp() {
  const [genre, setGenre] = useState('');
  const [artist, setArtist] = useState('');
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleArtistChange = (e) => {
    setArtist(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     if (genre) {
      fetchRecommendedArtists(genre);
    }
    if (artist) {
      fetchRecommendedEvents(artist);
    }
  };

  const fetchRecommendedEvents = (artist) => {
    const apiKey = 'pKiE2zYyc7KexxDyMtquVIRjuChhCFzo';
    const location = 'YOUR_USER_LOCATION';
  
    fetch(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artist}&apikey=${apiKey}&location=${location}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data?._embedded?.events || []);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="music-app">
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
          Submit
        </Button>
      </Form>

      <Tabs>
        <TabList>
          <Tab>Recommended Artists</Tab>
          <Tab>Recommended Events</Tab>
        </TabList>

        <TabPanel>
          {artists.map((artist) => (
            <div key={artist.id}>
              <h3>{artist.name}</h3>
              {/* other artist information */}
            </div>
          ))}
        </TabPanel>

        <TabPanel>
          {events.map((event) => (
            <div key={event.id}>
              <h3>{event.name}</h3>
              {/* other event information */}
            </div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default MusicApp;