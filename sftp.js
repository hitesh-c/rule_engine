const Client = require('ssh2-sftp-client');
const path = require('path');

const sftp = new Client();

const config = {
    host: 'your-sftp-server.com',  // Replace with the SFTP server address
    port: 22,                     // Default port for SFTP
    username: 'your-username',    // Replace with your username
    password: 'your-password'     // Replace with your password
    // Use privateKey instead of password if required:
    // privateKey: require('fs').readFileSync('path/to/private/key'),
};

async function uploadFile(localFilePath, remoteFilePath) {
    try {
        // Connect to the SFTP server
        await sftp.connect(config);
        console.log('Connected to SFTP server.');

        // Upload the file
        await sftp.put(localFilePath, remoteFilePath);
        console.log(`File uploaded successfully to ${remoteFilePath}`);

    } catch (err) {
        console.error('Error uploading file:', err);
    } finally {
        // Close the connection
        await sftp.end();
        console.log('Connection closed.');
    }
}

// Define the paths
const localFilePath = path.join(__dirname, 'local-file.txt'); // Replace with your local file path
const remoteFilePath = '/remote-directory/remote-file.txt';   // Replace with your remote file path

// Execute the upload function
uploadFile(localFilePath, remoteFilePath);
