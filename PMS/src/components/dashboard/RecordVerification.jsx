// components/dashboard/RecordVerification.jsx
export default function RecordVerification() {
  const [pendingRecords, setPendingRecords] = useState([]);

  useEffect(() => {
    // Fetch records needing verification
    const fetchRecords = async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.RECORDS,
        [Query.equal('status', 'pending')]
      );
      setPendingRecords(response.documents);
    };
    fetchRecords();
  }, []);

  const verifyRecord = async (recordId) => {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.RECORDS,
      recordId,
      { status: 'verified', lastVerifiedBy: currentUser.$id }
    );
  };

  return (
    <div>
      <h2>Records Pending Verification</h2>
      {pendingRecords.map(record => (
        <div key={record.$id} className="border p-4 my-2">
          <p>Patient: {record.patientName}</p>
          <p>Diagnosis: {record.diagnosis}</p>
          <button 
            onClick={() => verifyRecord(record.$id)}
            className="bg-green-500 text-white p-2"
          >
            Verify
          </button>
        </div>
      ))}
    </div>
  );
}