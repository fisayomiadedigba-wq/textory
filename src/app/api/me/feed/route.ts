import { ok, paged, pageWindow, readQuery, route } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import ChannelModel from '@/models/Channel';
import StoryModel from '@/models/Story';
import SubscriptionModel from '@/models/Subscription';
import { paginationSchema } from '@/schemas/common';
import { toStory, type StoryDoc } from '@/server/serializers';
import { storyChannelPopulate } from '@/server/stories';

/** Recently updated stories from channels the user subscribes to and their own channels. */
export const GET = route(async (request) => {
  const user = await requireUser();
  const page = readQuery(request, paginationSchema);
  const { skip, limit } = pageWindow(page);

  const subscriptions = await SubscriptionModel.find({ user: user.id }).select('channel').limit(1000).lean();
  const ownedChannels = await ChannelModel.find({ owner: user.id }).select('_id').lean();

  const channelIds = new Set([
    ...subscriptions.map((subscription) => subscription.channel),
    ...ownedChannels.map((channel) => channel._id),
  ]);

  if (channelIds.size === 0) return ok(paged([], page));

  const stories = await StoryModel.find({
    channel: { $in: Array.from(channelIds) },
    status: 'published',
  })
    .sort({ lastPublishedAt: -1, publishedAt: -1, createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate(storyChannelPopulate)
    .lean<StoryDoc[]>();

  return ok(paged(stories.map(toStory), page));
});
