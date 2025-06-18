import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databases, DATABASE_ID, COLLECTIONS } from '../../services/appwrite';

export default function AdminPanel() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          ['status = "pending"']
        );
        setPendingUsers(response.documents);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, []);

  const verifyUser = async (userId) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        userId,
        { status: 'verified' }
      );
      setPendingUsers(pendingUsers.filter(user => user.$id !== userId));
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending User Verifications</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending user verifications</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(user => (
              <div key={user.$id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => verifyUser(user.$id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}