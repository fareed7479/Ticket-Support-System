import React from 'react';
import './index.css';

const PriorityBadge = ({ priority }) => {
  const normalizedPriority = (priority || 'medium').toLowerCase();

  const priorityConfig = {
    low: { label: 'Low', className: 'badge-low' },
    medium: { label: 'Medium', className: 'badge-medium' },
    high: { label: 'High', className: 'badge-high' }
  };

  const config = priorityConfig[normalizedPriority] || priorityConfig.medium;

  return (
    <span className={`badge-pill ${config.className}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
