import './InputColumn.css';

const InputColumn = ({
  nameLabel,
  contentLabel,
  typeInput,
  idInput,
  placeholderInput,
  value,
  disabled = false,
  onChange,
  onFocus,
  onBlur,
}) => {
  const handleChange = (e) => {
    onChange(e); 
  };

  return (
    <div className="input-data">
      <label htmlFor={idInput}>{contentLabel}</label>
      <input
        type={typeInput}
        id={idInput}
        name={nameLabel}
        placeholder={placeholderInput}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputColumn;