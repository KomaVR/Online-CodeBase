import { exec } from 'child_process';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { code } = req.body;

        // Use a safe method to run the code. This example uses Node.js.
        exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ output: stderr || 'An error occurred during compilation.' });
            }
            res.status(200).json({ output: stdout || 'No output.' });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
