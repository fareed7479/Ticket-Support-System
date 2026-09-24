import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

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
    <div className="filter-card">
      <div className="filter-header">
        <Filter size={18} className="filter-header-icon" />
        <h3>Search & Filter Tickets</h3>
      </div>
      <div className="filter-grid">
        <div className="filter-group search-group">
          <label htmlFor="search-input">Search Keywords</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="search-input"
              type="text"
              placeholder="Search by subject or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="status-select">Status</label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-select">Priority</label>
          <select
            id="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-control"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {showSorting && setSortBy && (
          <div className="filter-group">
            <label htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="date">Newest First</option>
              <option value="priority">Priority (High to Low)</option>
            </select>
          </div>
        )}
      </div>

      {(search || status || priority || (showSorting && sortBy !== 'date')) && (
        <div className="filter-footer">
          <button onClick={onReset} className="btn-link btn-reset">
            <RotateCcw size={14} /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketFilter;
