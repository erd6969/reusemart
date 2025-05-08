import './ShowColumn.css';

const ShowColumn = ({
  nameLabel,
  contentLabel,
  typeInput,
  idInput,
  placeholderInput,
  value,
  disabled = false,
  onChange
}) => {
  const handleChange = (e) => {
    onChange && onChange(e); 
  };

  const InputComponent = typeInput === 'textarea' ? (
    <textarea
      id={idInput}
      name={nameLabel}
      placeholder={placeholderInput}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      rows={4}
    />
  ) : (
    <input
      type={typeInput}
      id={idInput}
      name={nameLabel}
      placeholder={placeholderInput}
      value={value}
      disabled={disabled}
      onChange={handleChange}
    />
  );

  return (
    <div className="show-data">
      <label htmlFor={idInput}>{contentLabel}</label>
      {InputComponent}
    </div>
  );
};

export default ShowColumn;