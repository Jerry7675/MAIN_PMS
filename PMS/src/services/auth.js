import { account, databases, DATABASE_ID, COLLECTIONS } from './appwrite';
import { Permission as AppwritePermission, Role } from 'appwrite';

// Improved authentication service
export const initApp = async () => {
  try {
    await account.getSession('current');
    return true;
  } catch (error) {
    return false;
  }
};

// Enhanced user registration
export const registerUser = async (name, email, password, role) => {
  try {
    // Prevent creating admin users through registration
    if (role === 'admin') {
      throw new Error('Admin accounts can only be created by system administrators');
    }

    // Create auth account
    const authUser = await account.create('unique()', email, password, name);
    
    // Create user document with proper permissions
    const dbUser = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      authUser.$id,
      {
        name,
        email,
        role,
        status: 'pending'
      },
      [
        AppwritePermission.read(Role.user(authUser.$id)),
        AppwritePermission.update(Role.user(authUser.$id))
      ]
    );
    
    return {
      ...authUser,
      ...dbUser
    };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// Enhanced login
export const loginUser = async (email, password) => {
  try {
    // Create session and verify credentials
    await account.createEmailSession(email, password);
    
    // Get full user data
    return await getCurrentUser();
  } catch (error) {
    // Handle specific error cases
    if (error.type === 'user_invalid_credentials') {
      throw new Error('Invalid email or password');
    }
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

// Get current user with role and status
export const getCurrentUser = async () => {
  try {
    // Get current session without throwing on 401
    try {
      await account.getSession('current');
    } catch (sessionError) {
      // Return null for 401 errors (no session)
      if (sessionError.code === 401) return null;
      throw sessionError;
    }
    
    // Get auth user data
    const authUser = await account.get();
    
    // Get user document from database
    const dbUser = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      authUser.$id
    );
    
    // Return combined user data
    return {
      id: authUser.$id,
      name: dbUser.name,
      email: authUser.email,
      role: dbUser.role,
      status: dbUser.status,
      emailVerified: authUser.emailVerification,
      prefs: authUser.prefs
    };
  } catch (error) {
    // Handle specific errors
    if ([401, 404].includes(error.code)) {
      return null;
    }
    console.error('Failed to get user:', error);
    throw error;
  }
};

// Check if user has specific role
export const hasRole = (user, requiredRole) => {
  return user && user.role === requiredRole;
};

// Check if user is verified
export const isVerified = (user) => {
  return user && user.status === 'verified';
};

// Send email verification
export const sendVerificationEmail = async () => {
  try {
    await account.createVerification(
      `${window.location.origin}/verify` // Your verification redirect URL
    );
    return true;
  } catch (error) {
    throw new Error(`Failed to send verification: ${error.message}`);
  }
};

// Complete email verification
export const verifyEmail = async (userId, secret) => {
  try {
    await account.updateVerification(userId, secret);
    return true;
  } catch (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }
};

// Password reset flow
export const createRecovery = async (email, redirectUrl) => {
  try {
    await account.createRecovery(email, redirectUrl);
    return true;
  } catch (error) {
    throw new Error(`Recovery failed: ${error.message}`);
  }
};

export const updatePassword = async (userId, secret, password) => {
  try {
    await account.updateRecovery(userId, secret, password);
    return true;
  } catch (error) {
    throw new Error(`Password update failed: ${error.message}`);
  }
};