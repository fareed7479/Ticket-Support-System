import React from 'react';
import './index.css';

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || 'open').toLowerCase();

  const statusConfig = {
    open: { label: 'Open', className: 'badge-open' },
    in_progress: { label: 'In Progress', className: 'badge-progress' },
    closed: { label: 'Resolved', className: 'badge-resolved' }
  };

  const config = statusConfig[normalizedStatus] || statusConfig.open;

  return (
    <span className={`badge-pill ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
