import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {ArrowUpDown, ArrowUp, ArrowDown} from 'lucide-react';
import {Button} from '@/components/ui/button';

const LogTable = ({
                      headers,
                      data,
                      sortConfig,
                      onSort,
                      formatDate,
                      currentPage,
                      setCurrentPage,
                      itemsPerPage = 50
                  }) => {
    const getSortIcon = (headerKey) => {
        if (sortConfig.key !== headerKey) return <ArrowUpDown className="h-4 w-4 text-gray-500"/>;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="h-4 w-4 text-primary"/>
            : <ArrowDown className="h-4 w-4 text-primary"/>;
    };

    const pageCount = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    const paginatedData = data.slice(startIndex, endIndex);

    const renderPagination = () => {
        if (pageCount <= 1) return null;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {endIndex} of {data.length} entries
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        First
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {startPage > 1 && <span className="px-2">...</span>}
                    {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(page => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    {endPage < pageCount && <span className="px-2">...</span>}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                        disabled={currentPage === pageCount}
                    >
                        Next
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pageCount)}
                        disabled={currentPage === pageCount}
                    >
                        Last
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((header) => (
                                <TableHead
                                    key={header.key}
                                    className="whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
                                    onClick={() => onSort(header.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {header.label}
                                        {getSortIcon(header.key)}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index} className="transition-colors">
                                <TableCell className="whitespace-nowrap font-medium text-left">
                                    {formatDate(row.timestamp)}
                                </TableCell>
                                {headers.slice(1).map((header) => (
                                    <TableCell key={header.key} className="whitespace-nowrap text-left">
                                        {row[header.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {renderPagination()}
        </div>
    );
};

export default LogTable;