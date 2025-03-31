import './InputColumn.css';

const InputColumn = ({nameLabel, contentLabel, typeInput, idInput, placeholderInput}) => {
    return (
      <div className="input-data">
        <label htmlFor={nameLabel}>{contentLabel}</label>
        <input type={typeInput} id={idInput} placeholder={placeholderInput} />
      </div>
    );
}

export default InputColumn;