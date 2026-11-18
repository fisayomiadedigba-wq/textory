import mongoose from 'mongoose';
import StoryModel from '../src/models/Story';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://adedigbaoluwaferanmi71_db_user:bSxVfDCb3UlaVivi@ac-o00yttj-shard-00-00.4p0m3mc.mongodb.net:27017,ac-o00yttj-shard-00-01.4p0m3mc.mongodb.net:27017,ac-o00yttj-shard-00-02.4p0m3mc.mongodb.net:27017/?ssl=true&replicaSet=atlas-12v53a-shard-0&authSource=admin';

async function fixLastPublishedAt() {
  await mongoose.connect(MONGODB_URI, { dbName: 'story_platform' });
  
  const result = await StoryModel.updateMany(
    { status: 'published', lastPublishedAt: null },
    { $set: { lastPublishedAt: new Date() } }
  );
  
  console.log(`Fixed ${result.modifiedCount} published stories`);
  
  await mongoose.disconnect();
}

fixLastPublishedAt().catch(console.error);
