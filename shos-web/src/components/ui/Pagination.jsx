import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}
      className={className}
    >
      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
