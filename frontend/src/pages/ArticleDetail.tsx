import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import type { Article } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const response = await api.get(`/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/articles/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete article', error);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!article) return null;

  const isAuthor = currentUser?.id === article.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white p-8 rounded-lg shadow-lg">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-500 space-x-4">
            <span className="font-medium text-gray-900">{article.authorName}</span>
            <span>•</span>
            <span>{format(new Date(article.createdAt), 'MMMM dd, yyyy')}</span>
            <span>•</span>
            <span>{article.viewCount} views</span>
          </div>
        </header>

        <div className="prose max-w-none mb-8 whitespace-pre-wrap">
          {article.content}
        </div>

        {isAuthor && (
          <div className="flex space-x-4 border-t pt-6">
            <Link
              to={`/edit-article/${article.id}`}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              Edit Article
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Delete Article
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleDetail;
