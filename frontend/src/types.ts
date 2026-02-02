export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  status: number;
  viewCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRequest {
  title: string;
  content: string;
  summary: string;
  status: number;
}

export interface PaginatedResponse<T> {
  articles: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
