import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PendingVerificationPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Account Pending Verification</h1>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <p className="mb-2">
            Your <span className="font-semibold">{user?.role}</span> account 
            <span className="font-semibold"> ({user?.email})</span> is awaiting approval.
          </p>
          
          <p className="text-sm text-gray-600">
            Please contact the system administrator to complete your verification.
          </p>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}