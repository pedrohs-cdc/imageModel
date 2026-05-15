import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = ({ height = '150px', className = '' }) => {
  return (
    <div className={`skeleton-card skeleton ${className}`} style={{ height }}></div>
  );
};

export default SkeletonCard;
