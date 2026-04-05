export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  source: string;
  source_url: string;
  created_at: string;
};

export type NewsDetail = NewsItem & {
  content?: string;
};

export type PaginatedNews = {
  page: number;
  pageSize: number;
  total: number;
  items: NewsItem[];
};
