import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import './index.css';

const TicketFilter = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  showSorting = false,
  onReset
}) => {
  return (
    <div className="filter-bar-flex">
      <div className="search-input-box">
        <Search size={16} className="search-icon" />
        <input
          id="search-input"
          type="text"
          placeholder="Search tickets by subject or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        id="status-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="select-filter-control"
      >
        <option value="">All Statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Resolved</option>
      </select>

      <select
        id="priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="select-filter-control"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {showSorting && setSortBy && (
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="select-filter-control"
        >
          <option value="date">Newest First</option>
          <option value="priority">Priority (High to Low)</option>
        </select>
      )}

      {(search || status || priority || (showSorting && sortBy !== 'date')) && (
        <button onClick={onReset} className="logout-btn" style={{ padding: '0.6rem 1rem' }}>
          <RotateCcw size={14} /> Clear
        </button>
      )}
    </div>
  );
};

export default TicketFilter;
