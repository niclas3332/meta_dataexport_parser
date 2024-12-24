import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import CategoryList from './CategoryList';
import FilterBar from './FilterBar';
import FileUpload from './FileUpload';
import LogTable from './LogTable';
import _ from 'lodash';

const ITEMS_PER_PAGE = 50;

const LogViewer = () => {
    const [categories, setCategories] = useState([]);
    const [categorizedData, setCategorizedData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [pages, setPages] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [groupBy, setGroupBy] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState([{ column: '', value: '' }]);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, groupBy, sortConfig]);

    const handleFilesProcessed = (data) => {
        const newCategories = Object.values(data).map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description
        }));
        setCategories(newCategories);
        setCategorizedData(data);
        setSelectedCategory(null);
        setPages([]);
    };

    const loadPages = async (categoryId) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 0)); // Async break
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                const pages = categorizedData[categoryId]?.pages || [];
                setPages(pages);
                setSelectedCategory(category);
                setGroupBy(null);
                setSortConfig({ key: null, direction: 'asc' });
                setFilters([{ column: '', value: '' }]);
                setExpandedGroups(new Set());
                setCurrentPage(1);
            }
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

    const handleFilterChange = (index, field, value) => {
        const newFilters = [...filters];
        newFilters[index] = { ...newFilters[index], [field]: value };
        setFilters(newFilters);
    };

    const addFilter = () => {
        setFilters([...filters, { column: '', value: '' }]);
    };

    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        if (newFilters.length === 0) {
            setFilters([{ column: '', value: '' }]);
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
                const row = { timestamp: entry.timestamp };
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
            const grouped = groupBy === 'timestamp'
                ? _.groupBy(data, row => formatDate(row.timestamp))
                : _.groupBy(data, groupBy);

            return _.mapValues(grouped, group =>
                _.orderBy(group, ['timestamp'], ['desc'])
            );
        }

        return { 'all': data };
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

    const headers = getTableHeaders();

    const renderGroupedContent = (groupedData) => (
        Object.entries(groupedData).map(([group, groupData]) => (
            <Collapsible
                key={group}
                className="space-y-2"
                open={expandedGroups.has(group)}
                onOpenChange={() => toggleGroup(group)}
            >
                <div className="border rounded-lg shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted">
                            <div className="flex items-center gap-2">
                                {expandedGroups.has(group) ?
                                    <ChevronDown className="h-4 w-4" /> :
                                    <ChevronRight className="h-4 w-4" />
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
                                <LogTable
                                    headers={headers}
                                    data={getPaginatedData(groupData)}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                    formatDate={formatDate}
                                />
                            </div>
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        ))
    );

    return (
        <div className="p-6 flex flex-col lg:flex-row gap-6 h-screen">
            {categories.length > 0 && (
                <div className="w-full lg:w-1/4">
                    <CategoryList
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={loadPages}
                    />
                </div>
            )}

            <div className="w-full lg:w-3/4 space-y-6">
                {selectedCategory ? (
                    <div className="space-y-6">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <CardTitle className="text-xl text-primary">
                                            {selectedCategory.name}
                                        </CardTitle>
                                        <a
                                            href="https://github.com/niclas3332/meta_dataexport_parser"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            View this project on GitHub
                                        </a>
                                    </div>
                                    <Select value={groupBy} onValueChange={setGroupBy}>
                                        <SelectTrigger className="w-full md:w-[240px]">
                                            <SelectValue placeholder="Group by field..." />
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

                                <FilterBar
                                    filters={filters}
                                    headers={headers}
                                    onFilterChange={handleFilterChange}
                                    onAddFilter={addFilter}
                                    onRemoveFilter={removeFilter}
                                />

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
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                                                            <div className="flex items-center justify-between p-4 hover:bg-muted">
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
                                                                    <LogTable
                                                                        headers={headers}
                                                                        data={groupData}
                                                                        sortConfig={sortConfig}
                                                                        onSort={handleSort}
                                                                        formatDate={formatDate}
                                                                        currentPage={currentPage}
                                                                        setCurrentPage={setCurrentPage}
                                                                        itemsPerPage={ITEMS_PER_PAGE}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CollapsibleContent>
                                                    </div>
                                                </Collapsible>
                                            ))
                                        ) : (
                                            <div className="rounded-lg border shadow-sm overflow-hidden">
                                                <LogTable
                                                    headers={headers}
                                                    data={getSortedAndGroupedData().all}
                                                    sortConfig={sortConfig}
                                                    onSort={handleSort}
                                                    formatDate={formatDate}
                                                    currentPage={currentPage}
                                                    setCurrentPage={setCurrentPage}
                                                    itemsPerPage={ITEMS_PER_PAGE}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Upload Log Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileUpload onFilesProcessed={handleFilesProcessed} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LogViewer;