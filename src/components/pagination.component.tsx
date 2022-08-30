/*
    Custom Pagination Component
    https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
*/

import { useMemo } from 'react';

import { Box, Button, IconButton } from '@chakra-ui/react';
import {
  CaretLeft,
  CaretDoubleLeft,
  CaretRight,
  CaretDoubleRight,
  DotsThree
} from 'phosphor-react';

interface PaginationHooksProps {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}

// constant and function for custom pagination hooks
const ELLIPSIS = '...';

const range = (start: number, end: number) => {
  let length = end - start + 1;

  // return an array of certain length and set the elements within it from start value to end value
  return Array.from({ length }, (_, index) => index + start);
};

// custom pagination hooks
const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}: PaginationHooksProps): any => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // pages count determined as siblingCount + firstPage + lastPage + currentPage + 2 * ellipsis
    const totalPageNumbers = siblingCount + 5;

    /*
      if the number of pages is less than the page numbers,
      render the pagination component
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
      calculate left and right sibling index and make sure
      they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      do not render ellipsis if there is only one position left after/before
      the left/right page count as that would lead to a change if the pagination
      component size
    */
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // no left ellipsis to render, but rightr ellipsis to be rendered
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, ELLIPSIS, totalPageCount];
    }

    // no right ellipsis to render, but left ellipsis to be rendered
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );

      return [firstPageIndex, ELLIPSIS, ...rightRange];
    }

    // both left and right ellipsis to be rendered
    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);

      return [
        firstPageIndex,
        ELLIPSIS,
        ...middleRange,
        ELLIPSIS,
        lastPageIndex
      ];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

interface PaginationProps {
  onPageChange: (page: number) => void; // eslint-disable-line
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // if there are less than 2 times in pagination range, do not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  let lastPage = paginationRange[paginationRange.length - 1];

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const onFirstPage = () => {
    onPageChange(1);
  };

  const onLastPage = () => {
    onPageChange(lastPage);
  };

  return (
    <Box>
      <IconButton
        aria-label="first-page"
        size="sm"
        variant="ghost"
        icon={<CaretDoubleLeft size="20px" />}
        disabled={currentPage === 1}
        onClick={onFirstPage}
      />
      <IconButton
        aria-label="previous-page"
        ml={2}
        size="sm"
        variant="ghost"
        icon={<CaretLeft size="20px" />}
        disabled={currentPage === 1}
        onClick={onPrevious}
      />
      {paginationRange?.map((pageNumber: any, index: number) => {
        if (pageNumber === ELLIPSIS) {
          return (
            <Button
              key={index}
              size="sm"
              variant="ghost"
              cursor="default"
              _active={{ bgColor: 'transparent' }}
              _hover={{ bgColor: 'transparent' }}
              _focus={{ outline: 'none' }}
            >
              <DotsThree size="20px" />
            </Button>
          );
        }

        return (
          <Button
            key={index}
            ml={2}
            size="sm"
            colorScheme={pageNumber === currentPage ? 'blue' : undefined}
            variant={pageNumber === currentPage ? 'solid' : 'ghost'}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}
      <IconButton
        aria-label="next-page"
        size="sm"
        variant="ghost"
        icon={<CaretRight size="20px" />}
        disabled={currentPage === lastPage}
        onClick={onNext}
      />
      <IconButton
        aria-label="last-page"
        ml={2}
        size="sm"
        variant="ghost"
        icon={<CaretDoubleRight size="20px" />}
        disabled={currentPage === lastPage}
        onClick={onLastPage}
      />
    </Box>
  );
};

export default Pagination;
