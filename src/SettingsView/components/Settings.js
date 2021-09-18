import React, { useContext } from 'react';

import ReactSlider from 'react-slider';

import { FetchContext } from '../../contexts/FetchContextProvider';

const Settings = () => {
  const { apiTimeDelay, setApiTimeDelay } = useContext(FetchContext);

  const handleChange = (value) => {
    setApiTimeDelay(value);
  };

  return (
    <div className="content">
      <div className="content__inner splitter">
        <aside className="slider-group">
          <div className="slider-group__inner">
            <div className="slider-group__inner__wrapper">
              <h4>Adjust updates frequency</h4>
              <div className="slider-container">
                <ReactSlider
                  className="slider"
                  thumbClassName="thumb"
                  trackClassName="track"
                  min={0}
                  max={30}
                  step={5}
                  value={apiTimeDelay}
                  onChange={handleChange}
                  renderThumb={(props, state) => (
                    <div {...props}>{state.valueNow}</div>
                  )}
                />
              </div>
              <ul className="slider-legend">
                <li className="legend__item">Driving: 0 seconds</li>
                <li className="legend__item">Cycling: 15 seconds</li>
                <li className="legend__item">Walking: 30 seconds</li>
              </ul>
            </div>
          </div>
        </aside>
        <article className="instructions-group">
          <div className="instructions-group__inner">
            <div className="instruction">
              <header className="instruction__header">
                <div>
                  <span>1</span>
                  <h3>Making your phone battery last longer</h3>
                </div>
              </header>
              <p>Location sharing can quickly drain your battery.</p>
              <p>
                To save it, ajust how often the app refreshes with new data.
              </p>
              <p>Make adustments based on how you commute.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Settings;
