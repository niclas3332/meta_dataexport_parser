import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const FilterBar = ({ filters, headers, onFilterChange, onAddFilter, onRemoveFilter }) => (
    <div className="space-y-4">
        {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-4">
                <Select
                    value={filter.column}
                    onValueChange={(value) => onFilterChange(index, 'column', value)}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select column to filter..." />
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
                    onChange={(e) => onFilterChange(index, 'value', e.target.value)}
                    className="w-64"
                />
                <Button variant="ghost" size="icon" onClick={() => onRemoveFilter(index)}>
                    <X className="h-4 w-4" />
                </Button>
                {index === filters.length - 1 && (
                    <Button variant="outline" size="icon" onClick={onAddFilter}>
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>
        ))}
    </div>
);
export default FilterBar;