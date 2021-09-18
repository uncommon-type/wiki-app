import React, { useState, useContext } from 'react';

import { SearchIcon } from '@heroicons/react/solid';
import { Loader } from '@googlemaps/js-api-loader';

import { FetchContext } from '../../contexts/FetchContextProvider';
import { GoogleContext } from '../../contexts/GoogleContextProvider';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const { setCenterCoords } = useContext(FetchContext);
  const { mapInstance, mapApi } = useContext(GoogleContext);

  const loader = new Loader({
    apiKey: 'AIzaSyDReDgyRM1t9H2HncIec_v_zh2DeJGggT0',
    id: '__googleMapsScriptId',
    libraries: ['places'],
    version: 'weekly',
  });

  const callGooglePlaces = async (query) => {
    const request = {
      query,
      fields: ['name', 'geometry'],
    };

    let service;
    if (mapApi && mapInstance) {
      service = new mapApi.places.PlacesService(mapInstance);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === mapApi.places.PlacesServiceStatus.OK) {
          setIsError(false);
          setCenterCoords({
            lat: results[0].geometry.location?.lat(),
            lng: results[0].geometry.location?.lng(),
          });
        }
        if (status !== mapApi.places.PlacesServiceStatus.OK) {
          setIsError(true);
        }
      });
    } else {
      const google = await loader.load();
      const map = new google.maps.Map(document.createElement('div'));
      service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setIsError(false);
          setCenterCoords({
            lat: results[0].geometry.location?.lat(),
            lng: results[0].geometry.location?.lng(),
          });
        }
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          setIsError(true);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.elements.query.value === '') {
      return;
    }
    setQuery(e.target.elements.query.value);
    await callGooglePlaces(query);
  };

  const handleChange = (e) => {
    setQuery(e.currentTarget.value);
    if (e.currentTarget.value === '') {
      setIsError(false);
    }
  };

  return (
    <form className="search-controls" onSubmit={handleSubmit}>
      <label htmlFor="search" className="visually-hidden">
        Search locations
      </label>
      <div className="search-controls__inner">
        <input
          value={query}
          onChange={handleChange}
          type="text"
          name="query"
          id="query"
          placeholder="Search"
          aria-label="Search for location"
        />
        <button type="submit" aria-label="Submit search">
          <span className="visually-hidden">Search</span>
          <SearchIcon className="icon-search" focusable="false" />
        </button>
      </div>
      {isError ? (
        <aside className="search-controls__error">
          <h2>Not found</h2>
        </aside>
      ) : null}
    </form>
  );
};

export default SearchBar;
