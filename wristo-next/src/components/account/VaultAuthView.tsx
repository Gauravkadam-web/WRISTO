'use client';

import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Sparkles, CheckCircle, Store, ShieldCheck } from 'lucide-react';
import { authService, AuthUser, UserRole } from '@/services/authService';

interface VaultAuthViewProps {
  onAuthSuccess: (user: AuthUser) => void;
}

export default function VaultAuthView({ onAuthSuccess }: VaultAuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');

  // Form states
  const [email, setEmail] = useState('admin@wristo.com');
  const [password, setPassword] = useState('Password@123');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'ADMIN') {
      setEmail('admin@wristo.com');
      setPassword('Password@123');
    } else if (role === 'SELLER') {
      setEmail('seller@wristo.com');
      setPassword('Password@123');
    } else {
      if (email === 'admin@wristo.com' || email === 'seller@wristo.com') {
        setEmail('');
        setPassword('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email.trim(), password);
        onAuthSuccess(user);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please provide your full legal or collector name.');
        }
        const user = await authService.register({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phoneNumber.trim(),
          role: selectedRole
        });
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication deviation occurred. Please check credentials and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vault-auth-container">
      <div className="vault-auth-card">
        {/* Luxury Monogram Header */}
        <div className="vault-auth-header">
          <div className="vault-auth-icon-wrap">
            <ShieldCheck size={28} strokeWidth={1.5} className="vault-auth-shield" />
          </div>
          <div className="section-label">HOROLOGICAL VAULT SECURITY</div>
          <h2 className="vault-auth-title">
            {mode === 'login' ? 'Enter Horological Vault' : 'Commission Client Register'}
          </h2>
          <p className="vault-auth-subtitle">
            {mode === 'login'
              ? 'Access authenticated provenance ledgers, insured order telemetry, and private collector allocations.'
              : 'Register your private horological identity to unlock 256-bit cryptographic certificates and VIP concierge.'}
          </p>
        </div>

        {/* Role Persona Switcher */}
        <div className="vault-role-selector" role="group" aria-label="Select Horological Persona">
          <button
            type="button"
            className={`vault-role-chip ${selectedRole === 'CUSTOMER' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('CUSTOMER')}
          >
            <Sparkles size={15} strokeWidth={1.5} />
            <span>Private Collector</span>
          </button>
          <button
            type="button"
            className={`vault-role-chip ${selectedRole === 'SELLER' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('SELLER')}
          >
            <Store size={15} strokeWidth={1.5} />
            <span>Boutique Partner</span>
          </button>
          <button
            type="button"
            className={`vault-role-chip ${selectedRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('ADMIN')}
          >
            <Shield size={15} strokeWidth={1.5} />
            <span>Executive Master</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="vault-mode-nav">
          <button
            type="button"
            className={`vault-mode-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            Sign In to Vault
          </button>
          <button
            type="button"
            className={`vault-mode-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(null); }}
          >
            New Collector Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="vault-auth-error" role="alert">
            <AlertCircle size={16} strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="vault-auth-form">
          {mode === 'register' && (
            <>
              <div className="vault-form-group">
                <label className="vault-form-label" htmlFor="fullName">
                  Full Name / Salutation
                </label>
                <div className="vault-input-wrap">
                  <User size={16} className="vault-input-icon" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g., Lord Aditya Vikram Singhania"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="vault-form-input"
                  />
                </div>
              </div>

              <div className="vault-form-group">
                <label className="vault-form-label" htmlFor="phone">
                  Contact Telemetry (Phone)
                </label>
                <div className="vault-input-wrap">
                  <Phone size={16} className="vault-input-icon" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="vault-form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="vault-form-group">
            <label className="vault-form-label" htmlFor="email">
              Vault Email Identifier
            </label>
            <div className="vault-input-wrap">
              <Mail size={16} className="vault-input-icon" />
              <input
                id="email"
                type="email"
                required
                placeholder="collector@horology.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vault-form-input"
              />
            </div>
          </div>

          <div className="vault-form-group">
            <label className="vault-form-label" htmlFor="password">
              Security Credential
            </label>
            <div className="vault-input-wrap">
              <Lock size={16} className="vault-input-icon" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vault-form-input"
              />
            </div>
          </div>

          {selectedRole === 'ADMIN' && mode === 'login' && (
            <div className="vault-quick-seed-hint">
              <CheckCircle size={13} color="var(--brand-bronze)" />
              <span>Default Executive Master: <code>admin@wristo.com</code> / <code>Password@123</code></span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary vault-submit-btn"
          >
            {isLoading ? (
              <span className="vault-spinner-text">Authenticating Ledger...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Unlock Private Vault' : 'Complete Registration'}</span>
                <ArrowRight size={16} strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <div className="vault-auth-footer-note">
          <Shield size={13} color="var(--color-text-muted)" />
          <span>Protected by 256-bit TLS encryption and cryptographic signature verification.</span>
        </div>
      </div>
    </div>
  );
}
