'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { adminService } from '@/services/adminService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@wristo.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await adminService.login(email, password);
      if (response.token) {
        router.push('/admin');
      } else {
        setError('Invalid executive credentials. Please check your email and password.');
      }
    } catch {
      setError('An error occurred during authentication. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-layout">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-lockup">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #DEC095 0%, #B08D6B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F0F0F'
            }}>
              <Shield size={22} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className="admin-login-title">WRISTO EXECUTIVE VAULT</h1>
          <p className="admin-login-subtitle">Administrative Security & Editorial Governance</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(185, 74, 72, 0.15)',
            border: '1px solid rgba(185, 74, 72, 0.3)',
            borderRadius: '6px',
            color: '#E57373',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Executive Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} strokeWidth={1.5} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted, #8A8A8A)'
              }} />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-form-input"
                style={{ paddingLeft: '38px', width: '100%' }}
                placeholder="admin@wristo.com"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Security Credential
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} strokeWidth={1.5} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted, #8A8A8A)'
              }} />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="admin-form-input"
                style={{ paddingLeft: '38px', width: '100%' }}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '11.5px',
            color: 'var(--color-text-muted, #8A8A8A)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Default Vault Seed:</span>
            <code style={{ color: 'var(--color-accent-champagne, #E8C89A)' }}>admin@wristo.com / Password@123</code>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="admin-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Vault</span>
                <ArrowRight size={15} strokeWidth={2} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
