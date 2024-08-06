import React from "react";

export default function Pagination({ currentPage, onPageChange, totlePage }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totlePage}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totlePage}
      >
        Next
      </button>
    </div>
  );
}
