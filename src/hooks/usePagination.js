import { useState } from 'react';

const usePagination = (itemsPerPage = 50) => {
    const [currentPage, setCurrentPage] = useState(1);

    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    return { currentPage, setCurrentPage, getPaginatedData };
};

export default usePagination;