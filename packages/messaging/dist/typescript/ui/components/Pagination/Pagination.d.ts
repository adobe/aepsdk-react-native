import React from "react";
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisibleDots?: number;
    activeColor?: string;
    inactiveColor?: string;
    dotSize?: number;
    spacing?: number;
}
export declare const Pagination: React.FC<PaginationProps>;
export default Pagination;
//# sourceMappingURL=Pagination.d.ts.map