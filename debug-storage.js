const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple .env parser since dotenv might not be installed
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing Connection to:", url);

if (!url || !key) {
    console.error("Missing keys in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function testBucket(bucketName) {
    console.log(`\n--- Testing Bucket: [${bucketName}] ---`);
    const fileName = `debug-test-${Date.now()}.txt`;

    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, 'Hello World', { upsert: true });

    if (error) {
        console.log(`❌ FAILED: ${error.message}`);
        // console.log("Details:", error); // Too verbose usually
        return false;
    } else {
        console.log(`✅ SUCCESS! File uploaded to ${bucketName}/${fileName}`);
        return true;
    }
}

async function run() {
    console.log("--- Listing Buckets ---");
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error listing buckets:", error.message);
    } else {
        console.log("Buckets found:", data.length);
        data.forEach(b => {
            console.log(`- ID: [${b.id}]  Name: [${b.name}]  Public: ${b.public}`);
        });
    }
}

run();
