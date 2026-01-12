const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function checkPassword() {
    const email = 'bbtswags@gmail.com';
    const passwordInput = '5445775445';

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    const match = await bcrypt.compare(passwordInput, user.password);
    console.log(`Password match for ${email}: ${match}`);
}

checkPassword()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
