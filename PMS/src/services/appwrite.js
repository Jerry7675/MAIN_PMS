import { Client, Account, Databases, Permission as AppwritePermission, Role, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = '685236d20039a6100e49';
export const COLLECTIONS = {
  USERS: '685236ef0034328051a9',
  RECORDS: '68523743002888434de5',
  CORRECTIONS: '68523754001967875c0b'
};

let isInitialized = false;

export const initDatabase = async () => {
  if (isInitialized) return true;

  try {
    // Skip checking if database exists – Appwrite doesn't support this on client side

    // 1. Initialize Users Collection
    await initCollection(
      COLLECTIONS.USERS,
      'Users',
      [
        { type: 'string', key: 'name', size: 255, required: true },
        { type: 'email', key: 'email', required: true },
        { type: 'string', key: 'role', size: 20, required: true },
        { type: 'string', key: 'status', size: 20, required: true }
      ],
      [
        AppwritePermission.read(Role.any()),
        AppwritePermission.update(Role.users()),
        AppwritePermission.delete(Role.users())
      ]
    );

    // 2. Initialize Records Collection
    await initCollection(
      COLLECTIONS.RECORDS,
      'Medical Records',
      [
        { type: 'string', key: 'patientId', size: 36, required: true },
        { type: 'string', key: 'doctorId', size: 36, required: true },
        { type: 'datetime', key: 'date', required: true }
      ],
      [
        AppwritePermission.read(Role.any()),
        AppwritePermission.create(Role.users()),
        AppwritePermission.update(Role.users())
      ]
    );

    // 3. Initialize Corrections Collection
    await initCollection(
      COLLECTIONS.CORRECTIONS,
      'Corrections',
      [
        { type: 'string', key: 'recordId', size: 36, required: true },
        { type: 'string', key: 'request', size: 1000, required: true }
      ]
    );

    isInitialized = true;
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Initialization error:', error.message);
    return false;
  }
};

async function initCollection(collectionId, name, attributes = [], permissions = []) {
  try {
    await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`Collection ${collectionId} already exists`);
  } catch (error) {
    if (error.code === 404) {
      await databases.createCollection(DATABASE_ID, collectionId, name, permissions);
      console.log(`Created collection ${collectionId}`);

      for (const attr of attributes) {
        try {
          switch (attr.type) {
            case 'string':
              await databases.createStringAttribute(DATABASE_ID, collectionId, attr.key, attr.size, attr.required);
              break;
            case 'email':
              await databases.createEmailAttribute(DATABASE_ID, collectionId, attr.key, attr.required);
              break;
            case 'datetime':
              await databases.createDatetimeAttribute(DATABASE_ID, collectionId, attr.key, attr.required);
              break;
          }
        } catch (attrError) {
          console.warn(`Error adding attribute ${attr.key}:`, attrError.message);
        }
      }
    } else {
      throw error;
    }
  }
}

export const initAdminUser = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'SecurePassword123!';

    try {
      await account.createEmailSession(adminEmail, 'dummy-password');
      console.log('Admin user exists');
      return;
    } catch {
      // proceed to create if session fails
    }

    const adminUser = await account.create(ID.unique(), adminEmail, adminPassword, 'System Admin');

    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      adminUser.$id,
      {
        name: 'System Admin',
        email: adminEmail,
        role: 'admin',
        status: 'verified'
      },
      [
        AppwritePermission.read(Role.any()),
        AppwritePermission.update(Role.user(adminUser.$id)),
        AppwritePermission.delete(Role.user(adminUser.$id))
      ]
    );

    console.log('Admin user created');
  } catch (error) {
    if (error.code === 409) {
      console.log('Admin user already exists');
    } else {
      console.error('Admin init error:', error.message);
    }
  }
};
