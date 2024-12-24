import { useState } from 'react';

const useFiltering = () => {
    const [filters, setFilters] = useState([{ column: '', value: '' }]);

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

    return { filters, handleFilterChange, addFilter, removeFilter, filterData };
};

export default useFiltering;