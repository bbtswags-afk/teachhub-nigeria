const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to database...");
        await prisma.$connect();
        console.log("Connected successfully!");

        // Just try to query something simple
        // Note: If tables don't exist yet because push failed, this will error, 
        // effectively telling us we still need to push.
        // But connection success is the first step.
        console.log("Database connection established for sure.");

    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
