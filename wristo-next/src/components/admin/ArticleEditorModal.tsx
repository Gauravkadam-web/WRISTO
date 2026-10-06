'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, BookOpen } from 'lucide-react';
import { AdminArticle } from '@/types/admin';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<AdminArticle>) => Promise<void>;
  articleToEdit?: AdminArticle | null;
}

export default function ArticleEditorModal({
  isOpen,
  onClose,
  onSave,
  articleToEdit
}: ArticleEditorModalProps) {
  const [formData, setFormData] = useState<Partial<AdminArticle>>({
    title: '',
    slug: '',
    excerpt: '',
    category: 'COLLECTING',
    coverImage: '/assets/articles/article-haute-horlogerie.png',
    authorName: 'Jean-Luc Laurent',
    authorRole: 'Senior Horological Curator',
    readTime: '6 min read',
    featured: false,
    published: true,
    content: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setFormData(articleToEdit);
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        category: 'COLLECTING',
        coverImage: '/assets/articles/article-haute-horlogerie.png',
        authorName: 'Jean-Luc Laurent',
        authorRole: 'Senior Horological Curator',
        readTime: '6 min read',
        featured: false,
        published: true,
        content: ''
      });
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      title,
      slug: articleToEdit ? prev.slug : slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save article:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(176, 141, 107, 0.15)',
              color: 'var(--color-accent-champagne, #E8C89A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={16} strokeWidth={1.5} />
            </div>
            <h2 className="admin-modal-title">
              {articleToEdit ? 'Edit Horological Essay' : 'Author New Journal Essay'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="admin-action-btn" aria-label="Close modal">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="admin-modal-body" style={{ overflowY: 'auto', flex: 1, maxHeight: '72vh' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Essay Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={handleTitleChange}
                placeholder="e.g. The Architecture of Precision: Inside the Tourbillon"
                className="admin-form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="the-architecture-of-precision"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Editorial Category</label>
                <select
                  value={formData.category || 'COLLECTING'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-form-select"
                >
                  <option value="COLLECTING">COLLECTING</option>
                  <option value="INDUSTRY">INDUSTRY</option>
                  <option value="SAVOIR-FAIRE">SAVOIR-FAIRE</option>
                  <option value="REVIEWS">REVIEWS</option>
                  <option value="AUCTIONS">AUCTIONS</option>
                  <option value="CURATION">CURATION</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Lead Excerpt / Summary</label>
              <textarea
                rows={2}
                required
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A compelling 2-sentence synopsis introducing the horological craft and historical context..."
                className="admin-form-textarea"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Author Name</label>
                <input
                  type="text"
                  required
                  value={formData.authorName || ''}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Author Role / Title</label>
                <input
                  type="text"
                  value={formData.authorRole || ''}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Estimated Read Time</label>
                <input
                  type="text"
                  value={formData.readTime || '5 min read'}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Cover Image Asset URL</label>
              <input
                type="text"
                value={formData.coverImage || ''}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="/assets/articles/article-haute-horlogerie.png"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Full Article Content (Markdown / HTML)</label>
              <textarea
                rows={7}
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter complete essay body with paragraphs, technical specs, and horological provenance..."
                className="admin-form-textarea"
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '24px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span style={{ color: 'var(--brand-ivory)' }}>Featured Lead Story</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <span style={{ color: 'var(--brand-ivory)' }}>Published Live</span>
              </label>
            </div>
          </div>

          <div className="admin-modal-footer" style={{ flexShrink: 0 }}>
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="admin-btn-primary">
              <Save size={14} strokeWidth={1.5} />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Essay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
