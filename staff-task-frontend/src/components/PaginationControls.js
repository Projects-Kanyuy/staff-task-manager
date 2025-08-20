// frontend/src/components/PaginationControls.js

import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    // If there's only one page (or none), don't show the pagination controls.
    if (totalPages <= 1) {
        return null; 
    }

    return (
        <div className="flex items-center justify-between mt-6" data-testid="pagination-controls">
            {/* Previous Page Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                // 'btn' and 'btn-ghost' are daisyui classes that will adapt to the theme.
                // 'btn-disabled' is automatically applied by daisyui when the button is disabled.
                className="btn btn-ghost"
            >
                <HiChevronLeft className="h-5 w-5" />
                Previous
            </button>

            {/* Page Counter */}
            <div className="text-sm text-base-content/70">
                Page <span className="font-bold text-base-content">{currentPage}</span> of <span className="font-bold text-base-content">{totalPages}</span>
            </div>

            {/* Next Page Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-ghost"
            >
                Next
                <HiChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

export default PaginationControls;