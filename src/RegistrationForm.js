
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import "./App.css"
import CountrySelect from './CountrySelect'; 
import "./CountrySelect.css"
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

const schema = yup.object().shape({
  firstName: yup.string().min(2, 'Imię musi zawierać co najmniej 2 znaki').matches(/^[a-zA-Z]+$/, 'Imię nie może zawierać cyfr ani znaków specjalnych').required('Imię jest wymagane'),
  lastName: yup.string().min(2, 'Nazwisko musi zawierać co najmniej 2 znaki').matches(/^[a-zA-Z]+$/, 'Nazwisko nie może zawierać cyfr ani znaków specjalnych').required('Nazwisko jest wymagane'),
  email: yup.string().email('Niepoprawny adres email').required('Email jest wymagany'),
  password: yup.string().min(8, 'Hasło musi mieć co najmniej 8 znaków').matches(/^(?=(.*[0-9]){2})(?=(.*[!@#$%^&*()\-_=+{};:,<.>]){3})/, 'Hasło musi zawierać co najmniej dwie cyfry i trzy znaki specjalne').required('Hasło jest wymagane'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Hasła muszą się zgadzać').required('Potwierdzenie hasła jest wymagane'),
  age: yup.number().nullable().transform((value, originalValue) => originalValue === '' ? null : value).min(18, 'Musisz mieć co najmniej 18 lat').max(99, 'Wiek nie może przekraczać 99 lat').required('Wiek jest wymagany'),
  birthDate: yup.date()
  .nullable().transform((value, originalValue) => originalValue === '' ? null : value).required('Data urodzenia jest wymagana').test('age-match', 'Data urodzenia nie zgadza się z wiekiem', function (value) {const age = this.parent.age;if (!value || !age) return true;return calculateAge(value) === parseInt(age, 10);}),
  country: yup.string().required('Kraj jest wymagany'),
  terms: yup.boolean().oneOf([true], 'Musisz zaakceptować regulamin'),
});
function RegistrationForm() {
  const [countries, setCountries] = useState([]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data.map(country => ({
          name: country.name.common,
          flag: country.flags.svg,
          code: country.cca2,
        })));
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const onSubmit = data => {
    console.log(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Imię:</label>
        <input {...register('firstName')} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>
      <div>
        <label>Nazwisko:</label>
        <input {...register('lastName')} />
        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Hasło:</label>
        <input type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label>Potwierdź hasło:</label>
        <input type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>
      <div>
        <label>Wiek:</label>
        <input type="number" {...register('age')} />
        {errors.age && <p>{errors.age.message}</p>}
      </div>
      <div>
        <label>Data urodzenia:</label>
        <input type="date" {...register('birthDate')} />
        {errors.birthDate && <p>{errors.birthDate.message}</p>}
      </div>
      <div>
        <label>Kraj:</label>
        <CountrySelect 
          countries={countries} 
          register={register} 
          name="country" 
          error={errors.country} 
        />
      </div>
      <div>
        <label>Płeć:</label>
        <select {...register('gender')}>
          <option value="">Wybierz płeć</option>
          <option value="male">Mężczyzna</option>
          <option value="female">Kobieta</option>
          <option value="other">Inna</option>
        </select>
      </div>
      <div>
        <label>Zgody marketingowe:</label>
        <input type="checkbox" {...register('marketing')} />
      </div>
      <div>
        <label>Zgoda na regulamin:</label>
        <input type="checkbox" {...register('terms')} />
        {errors.terms && <p>{errors.terms.message}</p>}
      </div>
      <button type="submit">Zarejestruj się</button>
    </form>
  );
}

export default RegistrationForm;
