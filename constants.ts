import { ContentItem } from './types';

export const MOCK_INITIAL_ITEMS: ContentItem[] = [
  {
    id: '1',
    title: 'The Future of React Server Components',
    source: 'newsletter',
    sourceName: 'React Weekly',
    previewText: 'Server Components are changing how we build hybrid applications. In this issue, we dive deep into the hydration mechanics...',
    fullContent: 'Server Components are changing how we build hybrid applications. In this issue, we dive deep into the hydration mechanics and how Next.js 14 implements them. The key takeaway is that we are moving towards a default-server mental model where client interactivity is opt-in.',
    url: 'https://react.dev',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    tags: ['React', 'Frontend', 'Performance'],
    isSaved: false,
    isRead: false,
  },
  {
    id: '2',
    title: 'Why I switched from VS Code to Zed',
    source: 'reddit',
    sourceName: 'r/programming',
    previewText: 'The performance difference is night and day. Rust-based architecture really shines when opening large monorepos...',
    fullContent: 'The performance difference is night and day. Rust-based architecture really shines when opening large monorepos. I was skeptical at first because of the lack of extensions, but the core experience is so much faster that I do not miss the bloat.',
    url: 'https://reddit.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    tags: ['Editors', 'Productivity', 'Rust'],
    isSaved: true,
    isRead: true,
  },
  {
    id: '3',
    title: 'Understanding PostgreSQL Indexing',
    source: 'newsletter',
    sourceName: 'ByteByteGo',
    previewText: 'B-Trees are the default, but have you considered BRIN indexes for time-series data? Here is a visual guide...',
    fullContent: 'B-Trees are the default, but have you considered BRIN indexes for time-series data? Here is a visual guide to how database pages are structured and why random I/O kills your query performance on spinning rust, though NVMe changes the math slightly.',
    url: 'https://blog.bytebytego.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    tags: ['Database', 'Backend', 'System Design'],
    isSaved: false,
    isRead: false,
  }
];

export const MOCK_NEW_SCRAPED_ITEMS: ContentItem[] = [
  {
    id: '4',
    title: 'Gemini 1.5 Pro is now available via API',
    source: 'reddit',
    sourceName: 'r/LocalLLaMA',
    previewText: 'Google just dropped the 1M context window model to the public API. The reasoning capabilities seem to surpass GPT-4 in specific retrieval tasks...',
    fullContent: 'Google just dropped the 1M context window model to the public API. The reasoning capabilities seem to surpass GPT-4 in specific retrieval tasks. I tested it with a 500 page PDF and it found the needle in the haystack instantly.',
    url: 'https://reddit.com',
    timestamp: new Date().toISOString(),
    tags: ['AI', 'LLM', 'Google'],
    isSaved: false,
    isRead: false,
  },
  {
    id: '5',
    title: 'Design Systems in 2025',
    source: 'newsletter',
    sourceName: 'Smashing Magazine',
    previewText: 'Tokens are out, semantic variables are in. We explore how major tech companies are restructuring their design languages...',
    fullContent: 'Tokens are out, semantic variables are in. We explore how major tech companies are restructuring their design languages to accommodate dark mode automatically and support multi-brand systems from a single codebase.',
    url: 'https://smashingmagazine.com',
    timestamp: new Date().toISOString(),
    tags: ['Design', 'CSS', 'System'],
    isSaved: false,
    isRead: false,
  }
];