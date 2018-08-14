import { observable, action } from 'mobx';
import Data from './port/data';
import Assets from './assets';

const nameToKey = input => input[0].toLowerCase() + input.slice(1).replace(/\s/g, '');
const sample = array => array[Math.floor(Math.random() * array.length)];

const state = observable({
  date: new Date(1522, 4, 17, 8),
  gold: 49273,
  portId: 1,
  building: 0,
  buildingMenuOptions: [],
  buildingMenuSelected: 0,

  timeOfDay: () => {
    const hour = state.date.getHours();

    if (hour >= 4 && hour < 8) {
      return 'dawn';
    }

    if (hour >= 8 && hour < 16) {
      return 'day';
    }

    if (hour >= 16 && hour < 20) {
      return 'dusk';
    }

    return 'night';
  },

  enterBuilding: action((id) => {
    const { name, greeting, menu } = Data.buildings[id];

    state.building = id;
    state.buildingGreeting = greeting || 'This feature is not implemented yet. Press ESC to exit this building.';
    state.buildingMenuOptions = menu;
    state.buildingMenuSelected = 0;
    state.buildingImg = Assets.assets.buildings[nameToKey(name)].src;
  }),

  exitBuilding: action(() => {
    const minutesPassed = sample([40, 60, 80]) * 60000;
    state.date = new Date(state.date.getTime() + minutesPassed);

    state.building = 0;
  }),

  buildingKeydown: action((e) => {
    if (e.key === 'Escape') {
      state.exitBuilding();
    }

    if (e.key === 'Enter') {
      if (state.buildingMenuOptions[state.buildingMenuSelected] === 'Sail') {
        state.setSail();
      }
    }

    if (e.key === 'w') {
      if (state.buildingMenuSelected <= 0) {
        state.buildingMenuSelected = state.buildingMenuOptions.length;
      }

      state.buildingMenuSelected -= 1;
    }

    if (e.key === 's') {
      state.buildingMenuSelected += 1;

      if (state.buildingMenuSelected >= state.buildingMenuOptions.length) {
        state.buildingMenuSelected = 0;
      }
    }
  }),

  buildingMousedown: action((e) => {
    if (e.button === 2) {
      state.exitBuilding();
    }
  }),

  buildingOnClick: action((i) => {
    state.buildingMenuSelected = i;

    if (state.buildingMenuOptions[state.buildingMenuSelected] === 'Sail') {
      state.setSail();
    }
  }),

  setSail: action(() => {
    state.portId = 0;
    state.building = 0;
  }),

  goAshore: action((portId) => {
    state.portId = portId;
  }),
});

export default state;