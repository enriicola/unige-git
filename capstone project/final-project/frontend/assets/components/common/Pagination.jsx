'use client';

import { Button } from '#components/common/Button';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      <Button
        type='button'
        onClick={handlePrev}
        disabled={currentPage === 1}
        variant='outline'
        size='sm'
        title='Go to the previous page'
      >
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          type='button'
          key={page}
          variant={page === currentPage ? 'primary' : 'outline'}
          size='sm'
          onClick={() => onPageChange(page)}
          title={`Go to page ${page}`}
        >
          {page}
        </Button>
      ))}
      <Button
        type='button'
        onClick={handleNext}
        disabled={currentPage === totalPages}
        variant='outline'
        size='sm'
        title='Go to the next page'
      >
        Next
      </Button>
    </div>
  );
}
