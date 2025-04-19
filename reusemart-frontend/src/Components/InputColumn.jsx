import './InputColumn.css';

const InputColumn = ({
  nameLabel,
  contentLabel,
  typeInput,
  idInput,
  placeholderInput,
  value,
  onChange
}) => {
  const handleChange = (e) => {
    // Teruskan event lengkap ke parent component
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
        onChange={handleChange}
      />
    </div>
  );
};

export default InputColumn;