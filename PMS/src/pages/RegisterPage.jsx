import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Patient Management System
                    </p>
                </div>
                
                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <RegisterForm />
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} Pokhara Engineering College</p>
                </div>
            </div>
        </div>
    );
}