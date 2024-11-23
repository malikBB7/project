export const getAccessToken = async () => {
    try {
        const response = await fetch('process.env.${BACK_END}/get-access-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId: '41f46ae1-1e05-4e30-870d-5e684c8ea7e2',
                tenantId: 'e4da8020-3c09-40ab-8fa0-1707bc163563',
                clientSecret: 'SIN8Q~iOmz3lV_loTO3Y6Z3h4kjyWcA~pSEcbbRJ',
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
