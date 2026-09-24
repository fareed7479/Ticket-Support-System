import React from 'react';

const PriorityBadge = ({ priority }) => {
  const normalizedPriority = (priority || 'medium').toLowerCase();

  const priorityConfig = {
    low: { label: 'Low', className: 'badge-priority-low' },
    medium: { label: 'Medium', className: 'badge-priority-medium' },
    high: { label: 'High', className: 'badge-priority-high' }
  };

  const config = priorityConfig[normalizedPriority] || priorityConfig.medium;

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
