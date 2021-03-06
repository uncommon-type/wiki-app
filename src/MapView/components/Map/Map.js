import { useState, useContext, useCallback } from "react";

import GoogleMapReact from "google-map-react";

import { LocationContext } from "../../../contexts/LocationContextProvider";
import { FetchContext } from "../../../contexts/FetchContextProvider";
import { GoogleContext } from "../../../contexts/GoogleContextProvider";

import Pin from "../Pin/Pin";
import UserMarker from "../UserMarker/UserMarker";
import Dialog from "../Dialog/Dialog";
import mapStyle from "../Map/mapStyle.json";

import styles from "./map.module.css";

const Map = () => {
  const [locationDetails, setLocationDetails] = useState(null);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const { data } = useContext(FetchContext);
  const { userPosition, centerCoords, setCenterCoords } = useContext(LocationContext);
  const { ready } = useContext(GoogleContext);

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
    [setCenterCoords]
  );

  return (
    <div className={styles["map"]}>
      {ready ? (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            libraries: ["places"],
            id: "__googleMapsScriptId",
            version: "weekly",
          }}
          center={centerCoords}
          defaultZoom={15}
          onDragEnd={(map) => handleMapDrag(map)}
          onTilesLoaded={() => setTilesLoaded(true)}
          options={mapStyle}
        >
          {tilesLoaded && data?.query?.pages?.length > 0
            ? data.query.pages.map((location) => {
                const { coordinates, pageid: id } = location;

                return (
                  <Pin
                    key={id}
                    lat={coordinates[0].lat}
                    lng={coordinates[0].lon}
                    imageUrl={location.thumbnail?.source || `${process.env.PUBLIC_URL}/placeholder.png`}
                    alt={location.title}
                    onClick={() => {
                      handlePinClick(location);
                    }}
                  />
                );
              })
            : null}
          {userPosition ? <UserMarker lat={userPosition.lat} lng={userPosition.lng} /> : null}
        </GoogleMapReact>
      ) : null}
      {locationDetails ? (
        <Dialog
          onDismiss={handleCloseDialog}
          ariaLabel="Location details"
          onClick={handleCloseDialog}
          locationDetails={locationDetails}
        />
      ) : null}
    </div>
  );
};
export default Map;
