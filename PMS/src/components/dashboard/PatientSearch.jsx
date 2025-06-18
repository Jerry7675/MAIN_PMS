// components/dashboard/PatientSearch.jsx
import { useState } from 'react';
import { databases } from '../../../services/appwrite';
import { DATABASE_ID, COLLECTIONS } from '../../../services/appwrite';

export default function PatientSearch({ onResults }) {
  const [query, setQuery] = useState('');

  const searchPatients = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [
        Query.startsWith('name', query),
        Query.equal('role', 'patient')
      ]
    );
    onResults(response.documents);
  };

  return (
    <div className="mb-6">
      <input 
        type="text"
        placeholder="Search patients by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={searchPatients} className="bg-blue-500 text-white p-2">
        Search
      </button>
    </div>
  );
}