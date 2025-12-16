export type SourceType = 'reddit' | 'newsletter';

export interface ContentItem {
  id: string;
  title: string;
  source: SourceType;
  sourceName: string; // e.g., "r/webdev" or "Morning Brew"
  previewText: string;
  fullContent: string;
  url: string;
  timestamp: string; // ISO string
  tags: string[];
  isSaved: boolean;
  isRead: boolean;
}

export interface GeneratedHook {
  id: string;
  contentItemId: string;
  text: string;
  createdAt: string;
  platform: 'twitter' | 'linkedin';
}

export type ViewState = 'feed' | 'saved' | 'settings';

export interface ScrapeStatus {
  isScraping: boolean;
  lastScraped: string | null;
  error: string | null;
}