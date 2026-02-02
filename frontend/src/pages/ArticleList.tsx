import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { Article, PaginatedResponse } from '@/types';
import { format } from 'date-fns';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Article>>(`/articles?page=${page}&size=10`);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Articles</h1>
        <Link 
          to="/create-article" 
          className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors"
        >
          Write Article
        </Link>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Link to={`/articles/${article.id}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-brand-primary">{article.title}</h2>
            </Link>
            <p className="text-gray-600 mb-4 line-clamp-3">{article.summary || article.content.substring(0, 150)}...</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>By {article.authorName}</span>
              <span>•</span>
              <span>{format(new Date(article.createdAt), 'MMM dd, yyyy')}</span>
              <span>•</span>
              <span>{article.viewCount} views</span>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No articles found. Be the first to write one!
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
