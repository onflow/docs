import {
  type ForumCellProps,
  type User,
} from '../ui/design-system/src/lib/Components/ForumCell';
import {
  DISCOURSE_API_URL,
  DISCOURSE_BREAKING_CHANGES_URL,
  DISCOURSE_LATEST_TOPICS_URL,
  DISCOURSE_MAINNET_SPORK_URL,
} from './constants';

export interface TopicsUser {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
}

export interface DiscourseTopicsResponse {
  users: TopicsUser[];
  primary_groups: any[];
  topic_list: TopicList;
}

export interface TopicList {
  can_create_topic: boolean;
  per_page: number;
  top_tags: any[];
  topics: Topic[];
}

export interface Topic {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  archetype: string;
  unseen: boolean;
  pinned: boolean;
  unpinned: string;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked: string;
  liked: string;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  featured_link: string;
  posters: any;
}

interface CategoryResponse {
  category: Category;
}

interface Category {
  id: number;
  name: string;
  color: string;
  text_color: string;
  slug: string;
  topic_count: number;
  post_count: number;
  position: number;
  description: string;
  description_text: string;
  description_excerpt: string;
  topic_url: string;
  read_restricted: boolean;
  permission: number;
  notification_level: number;
  can_edit: boolean;
  topic_template: string;
  has_children: string;
  sort_order: string;
  sort_ascending: string;
  show_subcategory_list: boolean;
  num_featured_topics: number;
  default_view: string;
  subcategory_list_style: string;
  default_top_period: string;
  default_list_filter: string;
  minimum_required_tags: number;
  navigate_to_first_post_after_read: boolean;
  custom_fields: any;
  allowed_tags: any[];
  allowed_tag_groups: any[];
  allow_global_tags: boolean;
  required_tag_groups: any;
  read_only_banner: string;
  available_groups: any[];
  auto_close_hours: string;
  auto_close_based_on_last_post: boolean;
  allow_unlimited_owner_edits_on_first_post: boolean;
  default_slow_mode_seconds: string;
  group_permissions: any;
  email_in: string;
  email_in_allow_strangers: boolean;
  mailinglist_mirror: boolean;
  all_topics_wiki: boolean;
  can_delete: boolean;
  allow_badges: boolean;
  topic_featured_link_allowed: boolean;
  search_priority: number;
  uploaded_logo: string;
  uploaded_background: string;
}

const createForumLink = (
  topicSlug: string,
  topicId: number,
  highestPostNumber: number,
): string =>
  [
    DISCOURSE_API_URL,
    't',
    topicSlug,
    topicId.toString(),
    highestPostNumber.toString(),
  ].join('/');

const convertToUser = (username: string, displayUrl: string) =>
  ({
    profileImage:
      displayUrl ??
      'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    name: username,
  } as User);

const convertTopicToForumCellProps = async (topic: Topic) =>
  ({
    numComments: topic.highest_post_number - 1,
    heading: topic.fancy_title,
    subheading: await fetchCategoryById(topic.category_id),
    participants: [convertToUser(topic.last_poster_username, topic.image_url)],
    lastUpdatedDate: topic.last_posted_at, // "YYYY-MM-DDTHH:MM:SS.XXXZ"
    forumLink: createForumLink(topic.slug, topic.id, topic.highest_post_number),
  } as ForumCellProps);

const formatLatestFiveTopics = async (topics: Topic[]) => {
  const fiveTopics = topics.slice(0, 5);
  const formattedTopics = fiveTopics.map(async (topic) => {
    const props = convertTopicToForumCellProps(topic);
    return await props;
  });

  const props = await Promise.all(formattedTopics);
  return props;
};
const fetchDiscourse = async <T>(url: string) => {
  return await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => await (response.json() as Promise<T>));
};

async function fetchCategoryById(id: number) {
  const data: CategoryResponse = await fetchDiscourse(
    [DISCOURSE_API_URL, 'c', id.toString(), 'show.json'].join('/'),
    // https://docs.discourse.org/#tag/Categories/operation/getCategory
  );

  const { category } = data;

  return category.name;
}

export async function fetchLatestTopics() {
  const data: DiscourseTopicsResponse = await fetchDiscourse(
    DISCOURSE_LATEST_TOPICS_URL,
    // https://docs.discourse.org/#tag/Topics/operation/listLatestTopics
  );

  const {
    topic_list: { topics },
  } = data;

  const formatted = await formatLatestFiveTopics(topics);

  return formatted;
}

// Category: Breaking Changes
export async function fetchBreakingChangesTopics() {
  const data: DiscourseTopicsResponse = await fetchDiscourse(
    DISCOURSE_BREAKING_CHANGES_URL,
    // https://docs.discourse.org/#tag/Categories/operation/listCategoryTopics
  );

  const {
    topic_list: { topics },
  } = data;

  return topics;
}

// Category: Mainnet Spork
export async function fetchMainnetSporkTopics() {
  const data: DiscourseTopicsResponse = await fetchDiscourse(
    DISCOURSE_MAINNET_SPORK_URL,
    // https://docs.discourse.org/#tag/Categories/operation/listCategoryTopics
  );

  const {
    topic_list: { topics },
  } = data;

  return topics;
}
