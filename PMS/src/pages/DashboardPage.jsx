import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-6">
                        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
                        <p className="text-lg mb-2">Role: {user?.role}</p>
                        <p className="text-lg">Status: {user?.status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}