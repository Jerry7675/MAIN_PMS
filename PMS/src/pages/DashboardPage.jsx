import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
        <p className="mb-2"><strong>Role:</strong> {user?.role}</p>
        <p className="mb-4"><strong>Status:</strong> {user?.status}</p>
        <p className="text-gray-600">
          {user?.role === 'patient' && 'Patient-specific features will appear here'}
          {user?.role === 'doctor' && 'Doctor-specific features will appear here'}
          {user?.role === 'management' && 'Management-specific features will appear here'}
        </p>
      </div>
    </div>
  );
}