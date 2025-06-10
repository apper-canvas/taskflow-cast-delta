import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import ErrorText from '@/components/atoms/ErrorText';

const FormField = ({ label, name, type = 'text', value, onChange, error, placeholder, options, rows, className = '' }) => {
  const handleChange = (e) => onChange(name, e.target.value);

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return <Textarea id={name} value={value} onChange={handleChange} placeholder={placeholder} rows={rows} error={error} />;
      case 'select':
        return <Select id={name} value={value} onChange={handleChange} options={options} error={error} />;
      default:
        return <Input id={name} type={type} value={value} onChange={handleChange} placeholder={placeholder} error={error} />;
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      {renderInput()}
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

export default FormField;