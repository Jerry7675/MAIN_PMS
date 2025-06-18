import { account, databases, DATABASE_ID, COLLECTIONS } from './appwrite';

// Initialize database on first run
export const initApp = async () => {
    try {
        await account.get();
        return true;
    } catch (e) {
        // Not authenticated
        return false;
    }
};

// Register new user
export const registerUser = async (name, email, password, role) => {
    try {
        // Create auth account
        const authUser = await account.create('unique()', email, password, name);
        
        // Create document in users collection
        const dbUser = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authUser.$id,
            {
                name,
                email,
                role,
                status: role === 'admin' ? 'verified' : 'pending'
            }
        );
        
        return dbUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        await account.createEmailSession(email, password);
        const user = await account.get();
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get current user with role
export const getCurrentUser = async () => {
    try {
        const authUser = await account.get();
        const dbUser = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authUser.$id
        );
        return {
            ...authUser,
            role: dbUser.role,
            status: dbUser.status
        };
    } catch (error) {
        return null;
    }
};