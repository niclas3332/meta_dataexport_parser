import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LogTable from './LogTable';

const GroupedContent = ({
                            headers,
                            groupedData,
                            sortConfig,
                            handleSort,
                            formatDate,
                            currentPage,
                            setCurrentPage,
                            itemsPerPage,
                            expandedGroups,
                            toggleGroup
                        }) => (
    Object.entries(groupedData).map(([group, groupData], index) => (
        <div key={group} className={`${index > 0 ? 'mt-4' : ''}`}> {/* Add margin-top for spacing */}
            <Collapsible
                className="space-y-2"
                open={expandedGroups.has(group)}
                onOpenChange={() => toggleGroup(group)}
            >
                <div className="border rounded-lg shadow-sm">
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted">
                            <div className="flex items-center gap-2">
                                {expandedGroups.has(group) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                <span className="font-semibold">{group}</span>
                                <Badge variant="secondary" className="ml-2">{groupData.length} entries</Badge>
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
                                    itemsPerPage={itemsPerPage}
                                />
                            </div>
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>
    ))
);

export default GroupedContent;