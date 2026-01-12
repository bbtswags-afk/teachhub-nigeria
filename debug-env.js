const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

console.log("Checking .env file at:", envPath);

try {
    if (fs.existsSync(envPath)) {
        console.log("File exists!");
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');

        console.log("--- Scanning Lines ---");
        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            if (trimmed.includes('SUPABASE')) {
                const parts = trimmed.split('=');
                const key = parts[0].trim();
                const hasValue = parts.length > 1 && parts[1].trim().length > 5;
                console.log(`Line ${idx + 1}: Found key [${key}] - Value Present: ${hasValue}`);

                // Check for common errors
                if (key !== key.trim()) console.log("  WARNING: Key has leading/trailing spaces");
                if (parts[1] && parts[1].includes(' ')) console.log("  WARNING: Value contains spaces (might need quotes)");
            }
        });
        console.log("--- End Scan ---");
    } else {
        console.log("ERROR: .env file does NOT exist.");
    }
} catch (err) {
    console.error("Error reading file:", err);
}
