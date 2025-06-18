
import { Client, Account, Databases } from 'appwrite';

const client = new Client()

  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)

  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = '685236d20039a6100e49';
export const COLLECTIONS = {
    USERS: 'us68523743002888434de5ers',
    RECORDS: '68523743002888434de5',
    CORRECTIONS: '68523754001967875c0b'
};

// Initialize collections if they don't exist (run once)
export const initDatabase = async () => {
    try {
        // Create database if not exists
        await databases.create(DATABASE_ID, 'Patient Management System');
        
        // Create users collection
        await databases.createCollection(
            DATABASE_ID,
            COLLECTIONS.USERS,
            'Users'
        );
        
        // Define user attributes
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            'name',
            255,
            true
        );
        await databases.createEmailAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            'email',
            true
        );
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            'role',
            20,
            true
        );
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTIONS.USERS,
            'status',
            20,
            true
        );
        
        // Create records collection
        await databases.createCollection(
            DATABASE_ID,
            COLLECTIONS.RECORDS,
            'Medical Records'
        );
        
        // Add attributes for records later
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.log('Database already initialized');
    }
};