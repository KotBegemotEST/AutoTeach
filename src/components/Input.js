import React from "react";

const Input = ({ id, type, label, value, onChange, disabled }) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
                className="form-group__input" 
                type={type} 
                id={id} 
                placeholder={label} 
                value={value} 
                onChange={onChange} 
                disabled={disabled} 
            />
        </div>
    );
};

export default Input;
