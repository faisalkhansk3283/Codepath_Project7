import React, { useState, useEffect } from 'react';
import './App.css';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssjhuwebaheofvstxbis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamh1d2ViYWhlb2Z2c3R4YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4ODMwNTAsImV4cCI6MjAxNDQ1OTA1MH0.-Pu3UQRNuENkCiSpJMXMyavD_d9b3CeUtvD3hdPfOMY'; // Replace with your Supabase API key

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [section, setSection] = useState('home');
  const [crewmates, setCrewmates] = useState([]);
  const [newCrewmate, setNewCrewmate] = useState({ name: '', speed: '', color: '' });
  const [editCrewmate, setEditCrewmate] = useState(null); // To store the crewmate being edited

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

  const handleCreateCrewmate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('Crewmate')
      .insert([
        {
          name: newCrewmate.name,
          speed: newCrewmate.speed,
          color: newCrewmate.color,
        },
      ]);
    if (error) {
      console.error('Error creating crewmate:', error);
    } else {
      // Clear input fields after creating a new crewmate
      setNewCrewmate({ name: '', speed: '', color: '' });
      // Fetch crewmates immediately after creating a new crewmate
      fetchCrewmates();
    }
  };

  const handleEditCrewmate = (crewmate) => {
    // Set the crewmate to be edited
    setEditCrewmate(crewmate);
    // Change the section to the edit form
    setSection('edit');
  };

  const handleUpdateCrewmate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('Crewmate')
      .update({
        name: editCrewmate.name,
        speed: editCrewmate.speed,
        color: editCrewmate.color,
      })
      .eq('id', editCrewmate.id);

    if (error) {
      console.error('Error updating crewmate:', error);
    } else {
      // Clear the editCrewmate and return to the gallery
      setEditCrewmate(null);
      setSection('gallery');
      // Fetch crewmates after updating
      fetchCrewmates();
    }
  };

  const handleDeleteCrewmate = async (id) => {
    const { error } = await supabase.from('Crewmate').delete().eq('id', id);
    if (error) {
      console.error('Error deleting crewmate:', error);
    } else {
      // Fetch crewmates after deleting a crewmate
      fetchCrewmates();
      // Redirect to the home section
      setSection('home');
    }
  };
  

  const fetchCrewmates = async () => {
    const { data, error } = await supabase.from('Crewmate').select('*');
    if (error) {
      console.error('Error fetching crewmates:', error);
    } else {
      setCrewmates(data);
    }
  };

  useEffect(() => {
    // Fetch crewmates when the component mounts
    fetchCrewmates();

    // Set up polling to periodically fetch updates
    const interval = setInterval(fetchCrewmates, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <button onClick={() => setSection('home')}>Home</button>
        <button onClick={() => setSection('create')}>Create Crewmate</button>
        <button onClick={() => setSection('gallery')}>Crewmate Gallery</button>
      </div>
      <div className="content">
        {section === 'home' && (
          <div>
            <h1>Welcome to Crewmate Manager</h1>
          </div>
        )}
        {section === 'create' && (
          <div>
            <h1>Create a New Crewmate</h1>
            <form onSubmit={handleCreateCrewmate}>
              <input
                type="text"
                placeholder="Name"
                value={newCrewmate.name}
                onChange={(e) => setNewCrewmate({ ...newCrewmate, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Speed"
                value={newCrewmate.speed}
                onChange={(e) => setNewCrewmate({ ...newCrewmate, speed: e.target.value })}
              />
              <select
                value={newCrewmate.color}
                onChange={(e) => setNewCrewmate({ ...newCrewmate, color: e.target.value })}
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <button type="submit">Create</button>
            </form>
          </div>
        )}
        {section === 'gallery' && (
  <div className="gallery-container">
    <h1>Crewmate Gallery</h1>
    {crewmates.map((crewmate) => (
      <div key={crewmate.id} className="crewmate-card">
        <p>Name: {crewmate.name}</p>
        <p>Speed: {crewmate.speed}</p>
        <p>Color: {crewmate.color}</p>
        <button onClick={() => handleEditCrewmate(crewmate)}>Edit</button>
        <button onClick={() => handleDeleteCrewmate(crewmate.id)}>Delete</button>
      </div>
    ))}
  </div>
)}

        {section === 'edit' && (
          <div>
            <h1>Edit Crewmate</h1>
            <form onSubmit={handleUpdateCrewmate}>
              <input
                type="text"
                placeholder="Name"
                value={editCrewmate.name}
                onChange={(e) => setEditCrewmate({ ...editCrewmate, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Speed"
                value={editCrewmate.speed}
                onChange={(e) => setEditCrewmate({ ...editCrewmate, speed: e.target.value })}
              />
              <select
                value={editCrewmate.color}
                onChange={(e) => setEditCrewmate({ ...editCrewmate, color: e.target.value })}
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <button type="submit">Update</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
