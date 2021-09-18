import React from 'react';

const Pin = ({ imageUrl, alt, onClick }) => (
  <div className="map-icon bounce" onClick={onClick} aria-hidden={true}>
    <img src={imageUrl} alt={alt} />
  </div>
);

export default Pin;
