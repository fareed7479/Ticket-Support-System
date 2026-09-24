import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || 'open').toLowerCase();

  const statusConfig = {
    open: { label: 'Open', className: 'badge-status-open' },
    in_progress: { label: 'In Progress', className: 'badge-status-progress' },
    closed: { label: 'Closed', className: 'badge-status-closed' }
  };

  const config = statusConfig[normalizedStatus] || statusConfig.open;

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
