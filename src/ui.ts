import type { CSSProperties } from 'react';

export const colors = {
  teal: '#154d45',
  ink: '#183b37',
  cream: '#fffaf3',
  sand: '#f7ead7',
  amber: '#b36b16',
  muted: '#777',
  border: '#e3d6c0',
  error: '#b3261e',
};

export const pageStyle: CSSProperties = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: colors.ink,
  background: colors.cream,
  minHeight: '100vh',
};

export const sectionStyle: CSSProperties = {
  padding: '25px 6%',
  maxWidth: 760,
  margin: '0 auto',
};

export const cardStyle: CSSProperties = {
  background: 'white',
  padding: 18,
  borderRadius: 14,
  boxShadow: '0 3px 14px #00000010',
};

export const primaryButton: CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 48,
  padding: '12px 18px',
  background: colors.teal,
  color: 'white',
  border: 'none',
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 700,
  textAlign: 'center',
  textDecoration: 'none',
  cursor: 'pointer',
};

export const smallButton: CSSProperties = {
  minHeight: 40,
  padding: '8px 18px',
  background: colors.teal,
  color: 'white',
  border: 'none',
  borderRadius: 10,
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
};

export const textButton: CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.error,
  fontSize: 14,
  padding: '8px 0',
  cursor: 'pointer',
  textDecoration: 'underline',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 14,
  borderRadius: 10,
  border: '1px solid #ccc',
  fontSize: 16,
  fontFamily: 'inherit',
};

export const demoBadge: CSSProperties = {
  display: 'inline-block',
  background: '#fdf0dc',
  color: colors.amber,
  border: `1px solid ${colors.amber}`,
  borderRadius: 6,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.5,
};

export const demoNotice: CSSProperties = {
  background: '#fdf0dc',
  border: `1px solid ${colors.amber}`,
  color: '#6b4010',
  padding: 12,
  borderRadius: 10,
  fontSize: 14,
  lineHeight: 1.4,
};
