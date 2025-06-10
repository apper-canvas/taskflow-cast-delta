import React from 'react';

const Select = ({ label, id, value, onChange, options, error, className = '', ...props }) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-') || `select-${Math.random().toString(36).substr(2, 9)}`;
  const selectClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
    error ? 'border-status-error' : 'border-surface-200'
  } ${className}`;

  return (
    <select
      id={selectId}
      value={value}
      onChange={onChange}
      className={selectClasses}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;