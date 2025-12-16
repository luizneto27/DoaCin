import React from 'react';
import '../animations.css';

const LoadingSkeleton = ({ type = 'default', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton skeleton-rect ${className}`} style={{ height: '200px' }} />
        );
      
      case 'avatar':
        return (
          <div className={`skeleton skeleton-circle ${className}`} style={{ width: '90px', height: '90px' }} />
        );
      
      case 'text':
        return Array.from({ length: count }).map((_, index) => (
          <div key={index} className={`skeleton skeleton-text ${className}`} style={{ marginBottom: '8px' }} />
        ));
      
      case 'title':
        return (
          <div className={`skeleton skeleton-title ${className}`} />
        );
      
      case 'stat-card':
        return (
          <div className={`skeleton skeleton-rect ${className}`} style={{ height: '120px', borderRadius: '12px' }} />
        );
      
      case 'profile':
        return (
          <div className={className}>
            <div className="skeleton skeleton-circle" style={{ width: '100px', height: '100px', margin: '0 auto 20px' }} />
            <div className="skeleton skeleton-text" style={{ width: '70%', margin: '0 auto 8px', height: '20px' }} />
            <div className="skeleton skeleton-text" style={{ width: '50%', margin: '0 auto', height: '16px' }} />
          </div>
        );
      
      case 'donation-item':
        return (
          <div className={`skeleton skeleton-rect ${className}`} style={{ height: '80px', marginBottom: '12px', borderRadius: '8px' }} />
        );
      
      case 'form':
        return (
          <div className={className}>
            <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '8px', height: '14px' }} />
            <div className="skeleton skeleton-rect" style={{ height: '48px', marginBottom: '20px', borderRadius: '8px' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '8px', height: '14px' }} />
            <div className="skeleton skeleton-rect" style={{ height: '48px', marginBottom: '20px', borderRadius: '8px' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%', marginBottom: '8px', height: '14px' }} />
            <div className="skeleton skeleton-rect" style={{ height: '48px', marginBottom: '20px', borderRadius: '8px' }} />
          </div>
        );
      
      case 'banner':
        return (
          <div className={`skeleton skeleton-rect ${className}`} style={{ height: '280px', borderRadius: '16px' }} />
        );
      
      default:
        return (
          <div className={`skeleton ${className}`} style={{ height: '20px', marginBottom: '8px' }} />
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingSkeleton;
