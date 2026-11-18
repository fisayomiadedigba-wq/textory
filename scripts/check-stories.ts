import mongoose from 'mongoose';
import StoryModel from '../src/models/Story';
import ChannelModel from '../src/models/Channel';
import UserModel from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://adedigbaoluwaferanmi71_db_user:bSxVfDCb3UlaVivi@ac-o00yttj-shard-00-00.4p0m3mc.mongodb.net:27017,ac-o00yttj-shard-00-01.4p0m3mc.mongodb.net:27017,ac-o00yttj-shard-00-02.4p0m3mc.mongodb.net:27017/?ssl=true&replicaSet=atlas-12v53a-shard-0&authSource=admin';

async function checkStories() {
  await mongoose.connect(MONGODB_URI, { dbName: 'story_platform' });
  
  const users = await UserModel.find().select('_id username email').lean();
  console.log('Users:', users.length);
  users.forEach(u => console.log(`  - ${u.username} (${u._id})`));
  
  const channels = await ChannelModel.find().select('_id owner handle name').lean();
  console.log('\nChannels:', channels.length);
  channels.forEach(c => console.log(`  - ${c.handle} (owner: ${c.owner})`));
  
  const stories = await StoryModel.find().select('_id title status channel lastPublishedAt publishedAt').lean();
  console.log('\nStories:', stories.length);
  stories.forEach(s => console.log(`  - ${s.title} (status: ${s.status}, channel: ${s.channel}, lastPublishedAt: ${s.lastPublishedAt})`));
  
  await mongoose.disconnect();
}

checkStories().catch(console.error);
