import { configureStore } from '@reduxjs/toolkit';
import { StoreConfig } from './state.types';
import * as models from '../../models';
import * as pages from '../../pages';
import socketer from '../socketer';

export const init = () => {
  const modelNames = Object.keys(models);
  const pageNames = Object.keys(pages);
  const config: StoreConfig = {
    reducer: {},
  };
  
  const addGlobalState = (entity) => {
    let state = entity._state ? entity._state : (entity.reducer && entity.config ? entity : null);

    if (!state) {
      return;
    } else if (!state.reducer || !state.config.name) {
      const subStates = Object.keys(state);

      addGlobalStates(subStates, state);
      return;
    }
    
    config.reducer[state.config.name] = state.reducer;
  };

  const addGlobalStates = (states, stateMap) => {
    states.forEach((name) => {
      addGlobalState(stateMap[name]);
    });
  };

  modelNames.forEach((name) => {
    addGlobalState(models[name]);
  });

  addGlobalState(socketer);
  addGlobalStates(modelNames, models);
  addGlobalStates(pageNames, pages);
  return configureStore(config);
};

export default {
  init,
};
