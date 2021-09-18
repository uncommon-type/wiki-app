import React, { useState, useContext, useCallback } from 'react';

import GoogleMapReact from 'google-map-react';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

import { FetchContext } from '../../contexts/FetchContextProvider';
import { GoogleContext } from '../../contexts/GoogleContextProvider';
import { ShareLocationContext } from '../../contexts/ShareLocationContextProvider';

import Pin from './Pin';
import UserMarker from './UserMarker';
import DialogBody from './DialogBody';
import mapStyle from './mapStyle.json';

const Map = () => {
  const [locationDetails, setLocationDetails] = useState(null);
  const { data, centerCoords, setCenterCoords } = useContext(FetchContext);
  const { userPosition } = useContext(ShareLocationContext);
  const { ready } = useContext(GoogleContext);
  const { zoom } = data;

  const handlePinClick = (location) => {
    setLocationDetails(location);
  };

  const handleCloseDialog = () => {
    setLocationDetails(null);
  };

  const handleMapDrag = useCallback(
    (map) => {
      setCenterCoords({
        lat: map.center.lat(),
        lng: map.center.lng(),
        panning: true,
      });
    },
    [setCenterCoords],
  );

  return (
    <div className="map">
      {ready ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyDReDgyRM1t9H2HncIec_v_zh2DeJGggT0',
            libraries: ['places'],
            id: '__googleMapsScriptId',
            version: 'weekly',
          }}
          center={centerCoords}
          defaultZoom={zoom}
          onDragEnd={(map) => handleMapDrag(map)}
          options={mapStyle}
        >
          {data?.query?.pages?.length > 0
            ? data.query.pages.map((location) => {
                const { coordinates, pageid: id } = location;

                return (
                  <Pin
                    key={id}
                    lat={coordinates[0].lat}
                    lng={coordinates[0].lon}
                    imageUrl={
                      location.thumbnail?.source ||
                      `${process.env.PUBLIC_URL}/placeholder.png`
                    }
                    alt={location.title}
                    onClick={() => {
                      handlePinClick(location);
                    }}
                  />
                );
              })
            : null}
          {userPosition ? (
            <UserMarker lat={userPosition.lat} lng={userPosition.lng} />
          ) : null}
        </GoogleMapReact>
      ) : null}
      {locationDetails ? (
        <Dialog
          className="dialog"
          onDismiss={handleCloseDialog}
          aria-label="Location details"
        >
          <DialogBody
            onClick={handleCloseDialog}
            locationDetails={locationDetails}
          />
        </Dialog>
      ) : null}
    </div>
  );
};

export default Map;