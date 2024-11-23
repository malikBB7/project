import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to get access token
app.post('/get-access-token', async (req, res) => {
    const { clientId, tenantId, clientSecret } = req.body;
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch access token' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update password endpoint
app.post('/update-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    const { access_token } = await getAccessToken();  // Ensure getAccessToken is correctly implemented

    try {
        // Fetch user item from SharePoint
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.REGISTER_LOGIN_LIST_ID}/items?$expand=fields($select=id,email,password)`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        const user = data.value.find(item => item.fields.email === email && item.fields.password === currentPassword);

        if (!user) {
            return res.status(404).json({ error: 'User not found or incorrect password' });
        }

        // Update password
        const updateResponse = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.REGISTER_LOGIN_LIST_ID}/items/${user.id}/fields`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            }
        );

        if (!updateResponse.ok) {
            throw new Error('Failed to update password');
        }

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user endpoint
app.post('/delete-user', async (req, res) => {
    const { email, password } = req.body;
    const { access_token } = await getAccessToken();  // Ensure getAccessToken is correctly implemented

    try {
        // Fetch user item from SharePoint
        const response = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.REGISTER_LOGIN_LIST_ID}/items?$expand=fields($select=id,email,password)`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        const user = data.value.find(item => item.fields.email === email && item.fields.password === password);

        if (!user) {
            return res.status(404).json({ error: 'User not found or incorrect password' });
        }

        // Delete user item
        const deleteResponse = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${process.env.SITE_ID}/lists/${process.env.REGISTER_LOGIN_LIST_ID}/items/${user.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        );

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete user');
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get access token
const getAccessToken = async () => {
    try {
        const response = await fetch('https://project-ten-wheat.vercel.app/get-access-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: process.env.CLIENT_ID,
                tenantId: process.env.TENANT_ID,
                clientSecret: process.env.CLIENT_SECRET,
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Failed to fetch access token: ${errorDetails.error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in getAccessToken:', error);
        throw error;
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
