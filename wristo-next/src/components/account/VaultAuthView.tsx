'use client';

import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Eye, EyeOff, Check, KeyRound } from 'lucide-react';
import { authService, AuthUser } from '@/services/authService';

interface VaultAuthViewProps {
  onAuthSuccess: (user: AuthUser) => void;
}

export default function VaultAuthView({ onAuthSuccess }: VaultAuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('admin@wristo.com');
  const [password, setPassword] = useState('Password@123');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickFill = (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError(null);
    setForgotMsg(null);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotMsg('For demo accounts, use password "Password@123". For assistance, contact support@wristo.com.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email.trim(), password);
        onAuthSuccess(user);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        const user = await authService.register({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phoneNumber.trim(),
          role: 'CUSTOMER'
        });
        onAuthSuccess(user);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('credential')) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(msg || 'An error occurred during authentication. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vault-auth-container" style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <div
        className="vault-auth-card"
        style={{
          backgroundColor: '#16161A',
          border: '1px solid rgba(222, 192, 149, 0.25)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          color: '#F5F5F7'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(222, 192, 149, 0.12)',
              border: '1px solid rgba(222, 192, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#DEC095'
            }}
          >
            <KeyRound size={24} strokeWidth={1.75} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '14px', color: '#A1A1AA', margin: 0, lineHeight: 1.5 }}>
            {mode === 'login'
              ? 'Sign in to view your orders, saved watches, and profile.'
              : 'Create an account to manage your orders, wishlist, and warranty certificates.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#0F0F12',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '24px',
            border: '1px solid #27272A'
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: mode === 'login' ? '#DEC095' : 'transparent',
              color: mode === 'login' ? '#0A0A0C' : '#A1A1AA'
            }}
            onClick={() => { setMode('login'); setError(null); setForgotMsg(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: mode === 'register' ? '#DEC095' : 'transparent',
              color: mode === 'register' ? '#0A0A0C' : '#A1A1AA'
            }}
            onClick={() => { setMode('register'); setError(null); setForgotMsg(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Demo Accounts Quick-Fill Pill Bar */}
        {mode === 'login' && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#1E1E24', borderRadius: '10px', border: '1px solid #2E2E38' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DEC095', fontWeight: 600, marginBottom: '8px' }}>
              Quick Demo Login:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@wristo.com', 'Admin')}
                style={{
                  fontSize: '11px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: email === 'admin@wristo.com' ? '#DEC095' : '#2A2A34',
                  color: email === 'admin@wristo.com' ? '#000000' : '#E4E4E7',
                  border: '1px solid #3F3F46',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Admin (admin@wristo.com)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('gauravkadam@gmail.com', 'Customer')}
                style={{
                  fontSize: '11px',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: email === 'gauravkadam@gmail.com' ? '#DEC095' : '#2A2A34',
                  color: email === 'gauravkadam@gmail.com' ? '#000000' : '#E4E4E7',
                  border: '1px solid #3F3F46',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Customer (gauravkadam@gmail.com)
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#F87171',
              fontSize: '13px',
              marginBottom: '20px'
            }}
            role="alert"
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Hint */}
        {forgotMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'rgba(222, 192, 149, 0.12)',
              border: '1px solid rgba(222, 192, 149, 0.3)',
              borderRadius: '8px',
              color: '#DEC095',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            <span>{forgotMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#D4D4D8' }} htmlFor="fullName">
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', color: '#71717A' }} />
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Gaurav Kadam"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      backgroundColor: '#1E1E24',
                      border: '1px solid #3F3F46',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#D4D4D8' }} htmlFor="phone">
                  Phone Number (Optional)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', color: '#71717A' }} />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 38px',
                      backgroundColor: '#1E1E24',
                      border: '1px solid #3F3F46',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#D4D4D8' }} htmlFor="email">
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: '#71717A' }} />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #3F3F46',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#D4D4D8' }} htmlFor="password">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ background: 'none', border: 'none', color: '#DEC095', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: '#71717A' }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 38px',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #3F3F46',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#DEC095', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '13px', color: '#A1A1AA', cursor: 'pointer' }}>
                Remember me on this device
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '8px',
              backgroundColor: '#DEC095',
              color: '#0A0A0C',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: '#71717A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Shield size={13} color="#71717A" />
          <span>256-bit SSL encrypted & secure checkout ready.</span>
        </div>
      </div>
    </div>
  );
}
