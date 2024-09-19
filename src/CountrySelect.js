import React, { useState } from 'react';
import './CountrySelect.css';

function CountrySelect({ countries, register, name, error }) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div className="custom-select">
      <select
        {...register(name)}
        className="select-country"
        value={selectedCountry}
        onChange={handleChange}
      >
        <option value="">Wybierz kraj</option>
        {countries.map(country => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      {selectedCountry && (
        <div className="country-flag">
          <img
            src={`https://flagcdn.com//${countries.find(c => c.name === selectedCountry)?.code.toLowerCase()}.svg`}
            alt={selectedCountry}
          />
          <span>{selectedCountry}</span>
        </div>
      )}
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default CountrySelect;