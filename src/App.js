import React, { useState, useEffect } from 'react';
import './App.css';

const routes = {
  "01A": ["Alpha", "Bravo", "Charlie", "Echo", "Golf"],
  "02B": ["Alpha", "Delta", "Echo", "Foxtrot", "Golf"],
  "03C": ["Charlie", "Delta", "Foxtrot", "Hotel", "India"],
  "04A": ["Charlie", "Delta", "Echo", "Foxtrot", "Golf"],
  "04D": ["Charlie", "Echo", "Foxtrot", "Golf", "India"],
  "06B": ["Delta", "Hotel", "Juliet", "Kilo", "Lima"],
  "06D": ["Delta", "Foxtrot", "Golf", "India", "Kilo"],
  "10C": ["Foxtrot", "Golf", "Hotel", "India", "Juliet"],
  "10H": ["Foxtrot", "Hotel", "Juliet", "Lima", "November"],
  "11A": ["Foxtrot", "Golf", "Kilo", "Mike", "November"],
  "11B": ["Foxtrot", "Golf", "Lima", "Oscar", "Papa"],
  "20A": ["India", "Juliet", "November", "Papa", "Romeo"],
  "20C": ["India", "Kilo", "Lima", "Mike", "Romeo"],
  "42C": ["Juliet", "Kilo", "Lima", "Mike", "Oscar"],
  "42D": ["Juliet", "November", "Oscar", "Quebec", "Romeo"]
};

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputsArray, setOutputsArray] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState({});

  useEffect(() => {
    console.log(keyValuePairs);
  }, [keyValuePairs]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setOutputsArray([]);
    setKeyValuePairs({})
  };
  
  const addKeyValuePair = (key, value) => {
    setKeyValuePairs(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const keyExists = (key) => {
    return keyValuePairs.hasOwnProperty(key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jeepCodes = inputValue.split(',').map(code => code.trim());
    if (validateInput(jeepCodes)) {
      const outputText = generateOutput(jeepCodes);
      console.log(keyValuePairs)
      setOutputsArray(prevOutputs => [...prevOutputs, outputText]);
      setInputValue('');
    } else {
      alert('Invalid input! Please enter valid Jeep Codes.');
    }
  };

  const validateInput = () => {
    const regex = /^\d{2}[A-Z](,\d{2}[A-Z])*$/;
    return regex.test(inputValue);
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  

  const generateOutput = (jeepCodes) => {
    let outputText = '';
    let elementColors = {}; 
    jeepCodes.forEach((code, index) => {
      if (routes[code]) {
        outputText += `${code} => `;
        routes[code].forEach((element, i) => {
          let elementColor = elementColors[element]; 
          if (!elementColor) { 
            if (keyExists(element)) {
              elementColor = keyValuePairs[element];
            } else {
              let newColor = "black"
                for (let j = 0; j < jeepCodes.length; j++) {
                  if (jeepCodes[j] !== code && routes[jeepCodes[j]].includes(element)) {
                    newColor = generateRandomColor();
                    } 
                }
                addKeyValuePair(element, newColor);
                elementColor = newColor;
            }
            elementColors[element] = elementColor;
          }
          outputText += `<span style="color: ${elementColor}">${element}</span>`;
          if (i !== routes[code].length - 1) outputText += ' <-> ';
        });
        if (index !== jeepCodes.length - 1) outputText += ', ';
      }
    });
    return outputText;
  };
  

  return (
    <div className="container">
      <h1>Jeep Route Finder</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Jeep Codes:
          <input type="text" value={inputValue} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="output" dangerouslySetInnerHTML={{ __html: outputsArray.join(', ') }} />
    </div>
  );
};

export default App;