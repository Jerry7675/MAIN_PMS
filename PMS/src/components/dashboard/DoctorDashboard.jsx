// components/dashboard/DoctorDashboard.jsx (search starter)
import { useState } from 'react';
import PatientSearch from './PatientSearch';

export default function DoctorDashboard() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <PatientSearch onResults={setSearchResults} />
      
      {searchResults.map(patient => (
        <div key={patient.$id}>
          <h3>{patient.name}</h3>
          <button onClick={() => viewRecords(patient.$id)}>View Records</button>
        </div>
      ))}
    </div>
  );
}