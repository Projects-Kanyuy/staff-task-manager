// frontend/src/components/FilterBar.js

import React from 'react';
import { HiFilter } from 'react-icons/hi';

const FilterBar = ({ users, onFilterChange, filters }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    return (
        <div className="bg-slate-900/50 border border-purple-500/20 p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4">
            <h3 className="flex items-center gap-2 font-semibold text-white">
                <HiFilter />
                Filters
            </h3>

            {/* Filter by Assignee */}
            <div className="flex-1 min-w-[150px]">
                <label htmlFor="assignee" className="sr-only">Assignee</label>
                <select
                    id="assignee"
                    name="assignee"
                    value={filters.assignee || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">All Assignees</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
            </div>

            {/* Filter by Priority */}
            <div className="flex-1 min-w-[150px]">
                <label htmlFor="priority" className="sr-only">Priority</label>
                <select
                    id="priority"
                    name="priority"
                    value={filters.priority || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

             {/* Sort By */}
            <div className="flex-1 min-w-[150px]">
                <label htmlFor="sort" className="sr-only">Sort By</label>
                <select
                    id="sort"
                    name="sort"
                    value={filters.sort || 'createdAtDesc'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-slate-200 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="createdAtDesc">Newest First</option>
                    <option value="dueDateAsc">Due Date (Asc)</option>
                    <option value="dueDateDesc">Due Date (Desc)</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;