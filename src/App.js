import React, { useState } from 'react';

const InputFieldAndButton = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    console.log(`The input value is: ${inputValue}`);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleChange} />
      <button onClick={handleClick}>Submit</button>
    </div>
  );
};

export default InputFieldAndButton;