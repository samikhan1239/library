// scripts/migrate-alerts.ts
import dbConnect from '@/lib/mongodb';
import Alert from '@/models/Alert';

async function migrateAlerts() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB...');

    // Add issueStatus: 'Not Issued' to ALL existing alerts that don't have it
    const result = await Alert.updateMany(
      { issueStatus: { $exists: false } },   // only documents without the field
      { $set: { issueStatus: 'Not Issued' } }
    );

    console.log(`Migration completed!`);
    console.log(`Updated ${result.modifiedCount} alerts.`);
    console.log(`Matched ${result.matchedCount} documents.`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrateAlerts();