import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Loader2} from 'lucide-react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import CategoryList from './CategoryList';
import FilterBar from './FilterBar';
import LogTable from './LogTable';
import GroupedContent from './GroupedContent';
import useSorting from '@/hooks/useSorting';
import useFiltering from '@/hooks/useFiltering';
import usePagination from '@/hooks/usePagination';
import FileUpload from '@/components/LogViewer/FileUpload.jsx';
import {Badge} from '@/components/ui/badge';
import _ from 'lodash';
import classnames from 'classnames';
import {useToast} from "@/hooks/use-toast"; // Pfad anpassen, falls anders

const LogViewer = () => {
    const [categories, setCategories] = useState([]);
    const [categorizedData, setCategorizedData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [groupBy, setGroupBy] = useState(null);
    const {sortConfig, handleSort} = useSorting();
    const {filters, handleFilterChange, addFilter, removeFilter, filterData} = useFiltering();
    const {currentPage, setCurrentPage} = usePagination();

    const [headers, setHeaders] = useState([]);

    const [sortedData, setSortedData] = useState([])
    const [groupedData, setGroupedData] = useState([])

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, groupBy, sortConfig]);

    const {toast} = useToast();


    const handleFilesProcessed = (data) => {
        const newCategories = Object.values(data).map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description
        }));
        setCategories(newCategories);
        setCategorizedData(data);
        setSelectedCategory(null);
        setLoading(false);
    };

    const loadPages = async (categoryId) => {
        console.log("loadPages")
        const timer = setTimeout(() => {
            setLoading(true);
        }, 200);
        try {

            await new Promise(resolve => setTimeout(resolve, 0)); // Async break
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                setSelectedCategory(category);
                setGroupBy(null);
                setExpandedGroups(new Set());
                setCurrentPage(1);
            }
        } finally {
            clearTimeout(timer);
            setLoading(false);
        }
    };


    useEffect(() => {

        const getTableHeaders = () => {
            if (!categorizedData[selectedCategory?.id]?.pages) return [];

            try {


                // Set to store unique labels
                const labelSet = new Set(['timestamp']);

                // Iterate over pages and entries
                categorizedData[selectedCategory.id].pages.forEach(page => {
                    if (!Array.isArray(page)) {
                        throw new Error("Page is not a valid list of entries.");
                    }
                    page.forEach(entry => {
                        if (!entry.label_values || !Array.isArray(entry.label_values)) {
                            throw new Error("Entry does not have valid label_values.");
                        }
                        entry.label_values.forEach(item => {
                            if (!item.label) {
                                throw new Error("A label is missing in one of the label_value entries.");
                            }
                            labelSet.add(item.label);
                        });
                    });
                });


                setHeaders(Array.from(labelSet).map(label => ({
                    label: label === 'timestamp' ? 'Timestamp' : label,
                    key: label
                })));
                // Return an array of labels
                return Array.from(labelSet).map(label => ({
                    label: label === 'timestamp' ? 'Timestamp' : label,
                    key: label
                }));
            } catch (error) {
                // Show a toast notification
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive", // Optional styling variant for errors
                });
                console.error(error);

                setHeaders(null);
            }
        };

        getTableHeaders();

    }, [selectedCategory])


    useEffect(() => {
        const getSortedAndGroupedData = () => {
            console.log("getSortedAndGroupedData")
            if (!selectedCategory) return {all: []};
            try {
                const pages = categorizedData[selectedCategory.id]?.pages || [];
                let data = pages.flatMap(page => page.map(entry => {
                    const row = {timestamp: entry.timestamp};
                    entry.label_values.forEach(item => row[item.label] = item.value);
                    return row;
                }));

                data = filterData(data);

                if (groupBy) {
                    const grouped = groupBy === 'timestamp'
                        ? _.groupBy(data, row => new Date(row.timestamp * 1000).toLocaleString())
                        : _.groupBy(data, groupBy);

                    // Sort only within groups
                    const sortedGrouped = _.mapValues(grouped, group => {
                        if (sortConfig.key) {
                            return _.orderBy(group, [sortConfig.key], [sortConfig.direction]);
                        }
                        return group;
                    });

                    setGroupedData(sortedGrouped)
                    return sortedGrouped;
                }

                if (sortConfig.key) {
                    data = _.orderBy(data, [sortConfig.key], [sortConfig.direction]);
                }
                setSortedData(data);
                return {all: data};
            } catch (error) {

                console.error(error);
                return {all: []};
            }

        };

        getSortedAndGroupedData();

    }, [selectedCategory, groupBy, sortConfig, filters])


    return (
        <div className="p-6 flex flex-col lg:flex-row gap-6">


            {categories.length > 0 && (
                <div className="w-full lg:w-1/4 shrink-0">
                    <CategoryList
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={loadPages}
                    />
                </div>

            )}


            <div className={classnames("w-full  space-y-6 ", {"lg:w-3/4": categories.length > 0})}>
                {selectedCategory && headers ? (
                    <div className="space-y-6  w-full">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <div
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
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
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 className="animate-spin text-muted-foreground" size={32}/>

                                    </div>
                                ) : (
                                    groupBy ? (
                                        <GroupedContent
                                            headers={headers}
                                            groupedData={groupedData}
                                            sortConfig={sortConfig}
                                            handleSort={handleSort}
                                            formatDate={timestamp => new Date(timestamp * 1000).toLocaleString()}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            itemsPerPage={50}
                                            expandedGroups={expandedGroups}
                                            toggleGroup={groupName => {
                                                const newExpanded = new Set(expandedGroups);
                                                if (newExpanded.has(groupName)) {
                                                    newExpanded.delete(groupName);
                                                } else {
                                                    newExpanded.add(groupName);
                                                }
                                                setExpandedGroups(newExpanded);
                                            }}
                                        />
                                    ) : (
                                        <div className="rounded-lg border shadow-sm">
                                            <LogTable
                                                headers={headers}
                                                data={sortedData}
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                                formatDate={timestamp => new Date(timestamp * 1000).toLocaleString()}
                                                currentPage={currentPage}
                                                setCurrentPage={setCurrentPage}
                                                itemsPerPage={50}
                                            />
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="shadow-sm w-full">
                        <CardHeader>
                            <CardTitle>Upload Log Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileUpload onFilesProcessed={handleFilesProcessed}/>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LogViewer;