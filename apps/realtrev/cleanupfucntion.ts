import cron from 'node-cron';
import prisma from '@repo/db/client';

// Schedule the job to run every hour
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running cleanup job...');
        const result = await prisma.$executeRaw`
            DELETE FROM "Updates"
            WHERE created_at <= NOW() - INTERVAL '24 hours';
        `;
        console.log(`Deleted ${result} outdated updates.`);
    } catch (error) {
        console.error('Error running cleanup job:', error);
    }
});
