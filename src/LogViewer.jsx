import  {useState, useEffect} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {ArrowUpDown, Loader2, X, ArrowUp, ArrowDown, Plus, ChevronRight, ChevronDown} from 'lucide-react';
import _ from 'lodash';

const ITEMS_PER_PAGE = 50;

const LogViewer = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [pages, setPages] = useState([]);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [groupBy, setGroupBy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState([{column: '', value: ''}]);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadCategories();

    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, groupBy, sortConfig]);

    const loadCategories = async () => {
        const newCategories = [];
        for (let i = 0; i <= 10; i++) {
            try {
                const response = await fetch(`/content/${i}/page_1.json`);
                if (!response.ok) continue;
                const data = await response.json();
                newCategories.push({
                    id: i,
                    name: data.name,
                    description: data.description
                });
            } catch (e) {
                console.log(`No data found in folder ${i}`);
            }
        }
        setCategories(newCategories);


    };

    const loadPages = async (categoryId) => {
        setLoading(true);
        const allPages = [];
        let pageNum = 1;
        try {
            while (true) {
                try {
                    const response = await fetch(`/content/${categoryId}/page_${pageNum}.json`);
                    if (!response.ok) break;
                    const data = await response.json();
                    allPages.push(...data.pages);
                    pageNum++;
                } catch (e) {
                    break;
                }
            }
            setPages(allPages);
            setSelectedCategory(categories.find(c => c.id === categoryId));
            setGroupBy(null);
            setSortConfig({key: null, direction: 'asc'});
            setFilters([{column: '', value: ''}]);
            setExpandedGroups(new Set());
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };

    const getTableHeaders = () => {
        if (pages.length === 0) return [];
        const labelSet = new Set();
        labelSet.add('timestamp');

        pages.forEach(page =>
            page.forEach(entry =>
                entry.label_values.forEach(item =>
                    labelSet.add(item.label)
                )
            )
        );

        return Array.from(labelSet).map(label => ({
            label: label === 'timestamp' ? 'Timestamp' : label,
            key: label
        }));
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const getSortIcon = (headerKey) => {
        if (sortConfig.key !== headerKey) return <ArrowUpDown className="h-4 w-4 text-gray-500"/>;
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="h-4 w-4 text-primary"/>
            : <ArrowDown className="h-4 w-4 text-primary"/>;
    };

    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filters];
        newFilters[index] = {...newFilters[index], [field]: value};
        setFilters(newFilters);
    };

    const addFilter = () => {
        setFilters([...filters, {column: '', value: ''}]);
    };

    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        if (newFilters.length === 0) {
            setFilters([{column: '', value: ''}]);
        } else {
            setFilters(newFilters);
        }
    };

    const filterData = (data) => {
        return data.filter(row =>
            filters.every(filter => {
                if (!filter.column || !filter.value) return true;
                const value = row[filter.column];
                return value && String(value).toLowerCase().includes(filter.value.toLowerCase());
            })
        );
    };

    const getSortedAndGroupedData = () => {
        let data = pages.flatMap((page, pageIndex) =>
            page.map((entry) => {
                const row = {timestamp: entry.timestamp};
                entry.label_values.forEach(item => {
                    row[item.label] = item.value;
                });
                return row;
            })
        );

        data = filterData(data);

        if (sortConfig.key) {
            data = _.orderBy(data, [sortConfig.key], [sortConfig.direction]);
        }

        if (groupBy) {
            const grouped = _.groupBy(data, groupBy);
            return _.mapValues(grouped, group =>
                _.orderBy(group, ['timestamp'], ['desc'])
            );
        }

        return {'all': data};
    };

    const toggleGroup = (groupName) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupName)) {
            newExpanded.delete(groupName);
        } else {
            newExpanded.add(groupName);
        }
        setExpandedGroups(newExpanded);
    };

    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const getPageCount = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

    const renderPagination = (data) => {
        const pageCount = getPageCount(data);
        if (pageCount <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return (
            <div className="flex items-center justify-between px-2 py-4 border-t">
                <div className="text-sm text-card">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of {data.length} entries
                </div>
                <div className="flex gap-2">
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

    const renderTableContent = (data) => {
        const paginatedData = getPaginatedData(data);
        return (
            <>
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            {headers.map((header) => (
                                <TableHead
                                    key={header.key}
                                    className="whitespace-nowrap cursor-pointer hover:bg-muted transition-colors"
                                    onClick={() => handleSort(header.key)}
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
                            <TableRow
                                key={index}
                                className=" transition-colors"
                            >
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
                {renderPagination(data)}
            </>
        );
    };

    const headers = getTableHeaders();

    return (
        <div className="p-6 flex gap-6 h-screen ">
            <div className="w-1/4 space-y-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[calc(100vh-12rem)]">
                        <div className="p-4 space-y-3">
                            {categories.map((category) => (
                                <Card
                                    key={category.id}
                                    className={`transition-colors cursor-pointer hover:bg-muted ${
                                        selectedCategory?.id === category.id ? 'bg-muted border-primary' : ''
                                    }`}
                                    onClick={() => loadPages(category.id)}
                                >
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-primary">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            <div className="w-3/4 space-y-6">
                {selectedCategory && (
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <CardTitle className="text-xl text-primary">
                                        {selectedCategory.name}
                                    </CardTitle>
                                    <Select value={groupBy} onValueChange={setGroupBy}>
                                        <SelectTrigger className="w-[240px]">
                                            <SelectValue placeholder="Group by field..."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={null}>No grouping</SelectItem>
                                            {headers.map(header => (
                                                <SelectItem key={header.key} value={header.key}>
                                                    Group by {header.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    {filters.map((filter, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <Select
                                                value={filter.column}
                                                onValueChange={(value) => handleFilterChange(index, 'column', value)}
                                            >
                                                <SelectTrigger className="w-[240px]">
                                                    <SelectValue placeholder="Select column to filter..."/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {headers.map(header => (
                                                        <SelectItem key={header.key} value={header.key}>
                                                            {header.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                placeholder="Filter value..."
                                                value={filter.value}
                                                onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                                                className="w-64"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFilter(index)}
                                            >
                                                <X className="h-4 w-4"/>
                                            </Button>
                                            {index === filters.length - 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={addFilter}
                                                >
                                                    <Plus className="h-4 w-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {sortConfig.key && (
                                    <div className="flex gap-2 mt-4">
                                        <Badge variant="secondary">
                                            Sorted by: {headers.find(h => h.key === sortConfig.key)?.label}
                                            ({sortConfig.direction})
                                        </Badge>
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center p-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {groupBy ? (
                                            Object.entries(getSortedAndGroupedData()).map(([group, groupData]) => (
                                                <Collapsible
                                                    key={group}
                                                    className="space-y-2"
                                                    open={expandedGroups.has(group)}
                                                    onOpenChange={() => toggleGroup(group)}
                                                >
                                                    <div className="border rounded-lg shadow-sm">
                                                        <CollapsibleTrigger className="w-full">
                                                            <div
                                                                className="flex items-center justify-between p-4 hover:bg-muted">
                                                                <div className="flex items-center gap-2">
                                                                    {expandedGroups.has(group) ?
                                                                        <ChevronDown className="h-4 w-4"/> :
                                                                        <ChevronRight className="h-4 w-4"/>
                                                                    }
                                                                    <span className="font-semibold">{group}</span>
                                                                    <Badge variant="secondary" className="ml-2">
                                                                        {groupData.length} entries
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    Latest: {formatDate(groupData[0].timestamp)}
                                                                </div>
                                                            </div>
                                                        </CollapsibleTrigger>
                                                        <CollapsibleContent>
                                                            <div className="border-t">
                                                                <div className="overflow-x-auto">
                                                                    {renderTableContent(groupData)}
                                                                </div>
                                                            </div>
                                                        </CollapsibleContent>
                                                    </div>
                                                </Collapsible>
                                            ))
                                        ) : (
                                            <div className="rounded-lg border shadow-sm overflow-hidden">
                                                {renderTableContent(getSortedAndGroupedData().all)}
                                            </div>
                                        )}
                                    </div>
                                )
                                }
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogViewer;