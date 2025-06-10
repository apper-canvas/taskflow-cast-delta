import React from 'react';

const Select = ({ label, id, value, onChange, options = [], error, className = '', ...props }) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-') || `select-${Math.random().toString(36).substr(2, 9)}`;
  const selectClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
    error ? 'border-status-error' : 'border-surface-200'
  } ${className}`;

  // Ensure options is always an array and handle edge cases
  const safeOptions = React.useMemo(() => {
    if (!options) return [];
    if (!Array.isArray(options)) return [];
    return options.filter(option => option && typeof option === 'object' && option.value !== undefined);
  }, [options]);

  return (
    <select
      id={selectId}
      value={value}
      onChange={onChange}
      className={selectClasses}
      {...props}
    >
      {safeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
};

export default Select;