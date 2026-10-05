'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  Filter
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminArticle } from '@/types/admin';
import ArticleEditorModal from '@/components/admin/ArticleEditorModal';

export default function AdminJournalCMSPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<AdminArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<AdminArticle | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    let result = [...articles];

    if (selectedCategory !== 'ALL') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q)
      );
    }

    setFilteredArticles(result);
  }, [searchQuery, selectedCategory, articles]);

  const handleOpenCreate = () => {
    setArticleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: AdminArticle) => {
    setArticleToEdit(article);
    setIsModalOpen(true);
  };

  const handleSaveArticle = async (articleData: Partial<AdminArticle>) => {
    await adminService.saveArticle(articleData);
    await loadArticles();
  };

  const handleTogglePublish = async (article: AdminArticle) => {
    await adminService.saveArticle({
      ...article,
      published: !article.published
    });
    await loadArticles();
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Are you sure you wish to delete this horological essay? This cannot be undone.')) {
      await adminService.deleteArticle(id);
      await loadArticles();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: 500,
            color: 'var(--brand-ivory, #F7F3EC)',
            marginBottom: '4px'
          }}>
            Editorial Journal & Essays CMS
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Publish horological essays, collectors analysis, and Haute Horlogerie guides for WRISTO readers.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="admin-btn-primary">
          <Plus size={15} strokeWidth={2} />
          <span>New Essay</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} strokeWidth={1.5} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                type="text"
                placeholder="Search essays by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
                style={{ paddingLeft: '34px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} strokeWidth={1.5} color="var(--brand-bronze)" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-form-select"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                <option value="ALL">All Categories</option>
                <option value="COLLECTING">COLLECTING</option>
                <option value="INDUSTRY">INDUSTRY</option>
                <option value="SAVOIR-FAIRE">SAVOIR-FAIRE</option>
                <option value="REVIEWS">REVIEWS</option>
                <option value="AUCTIONS">AUCTIONS</option>
                <option value="CURATION">CURATION</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredArticles.length}</strong> of {articles.length} essays
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Essay & Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Role / Focus</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    Loading editorial catalog...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No essays found matching your query.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backgroundImage: `url(${article.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--brand-ivory)', marginBottom: '2px' }}>
                            {article.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                            /journal/{article.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        color: 'var(--brand-bronze)'
                      }}>
                        {article.category}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{article.authorName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{article.readTime}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${article.published ? 'success' : 'warning'}`}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      {article.featured && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--color-accent-champagne)',
                          background: 'rgba(232, 200, 154, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(232, 200, 154, 0.25)'
                        }}>
                          <Sparkles size={11} strokeWidth={1.5} />
                          Lead Story
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link
                          href={`/journal/${article.slug}`}
                          target="_blank"
                          className="admin-action-btn"
                          title="View Live Reader"
                        >
                          <ExternalLink size={13} strokeWidth={1.5} />
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className="admin-action-btn"
                          title={article.published ? 'Unpublish' : 'Publish'}
                        >
                          {article.published ? <EyeOff size={13} strokeWidth={1.5} /> : <Eye size={13} strokeWidth={1.5} />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(article)}
                          className="admin-action-btn"
                          title="Edit Essay"
                        >
                          <Edit2 size={13} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="admin-action-btn"
                          title="Delete Essay"
                          style={{ color: '#E57373' }}
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <ArticleEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
      />
    </div>
  );
}
