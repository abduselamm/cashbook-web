import { google } from 'googleapis';

const HISAB_DB_FILENAME = 'hisab_db.json';

// Initialize Drive Client
export const getDriveClient = (accessToken: string) => {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    return google.drive({ version: 'v3', auth });
};

// Find the database file
export const findDatabaseFile = async (accessToken: string) => {
    const drive = getDriveClient(accessToken);

    try {
        const response = await drive.files.list({
            q: `name = '${HISAB_DB_FILENAME}' and trashed = false`,
            fields: 'files(id, name)',
            spaces: 'drive',
        });

        const files = response.data.files;
        if (files && files.length > 0) {
            return files[0].id; // Return the first matching file ID
        }
        return null;
    } catch (error) {
        console.error('Error finding database file:', error);
        throw error;
    }
};

// Create the database file with initial data
export const createDatabaseFile = async (accessToken: string, initialData: any) => {
    const drive = getDriveClient(accessToken);

    try {
        const fileMetadata = {
            name: HISAB_DB_FILENAME,
            mimeType: 'application/json',
        };

        const media = {
            mimeType: 'application/json',
            body: JSON.stringify(initialData, null, 2),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });

        return response.data.id;
    } catch (error) {
        console.error('Error creating database file:', error);
        throw error;
    }
};

// Read the database file
export const readDatabaseFile = async (accessToken: string, fileId: string) => {
    const drive = getDriveClient(accessToken);

    try {
        const response = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        });

        return response.data;
    } catch (error) {
        console.error('Error reading database file:', error);
        throw error;
    }
};

// Update the database file
export const updateDatabaseFile = async (accessToken: string, fileId: string, data: any) => {
    const drive = getDriveClient(accessToken);

    try {
        const media = {
            mimeType: 'application/json',
            body: JSON.stringify(data, null, 2),
        };

        await drive.files.update({
            fileId: fileId,
            media: media,
        });

        return true;
    } catch (error) {
        console.error('Error updating database file:', error);
        throw error;
    }
};
