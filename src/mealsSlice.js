// mealsSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const mealsSlice = createSlice({
  name: 'meals',

  // put the initial state of the meals 
  initialState: [
    { name: 'Breakfast', cost: 50, selected: false },
    { name: 'High Tea', cost: 25, selected: false },
    { name: 'Lunch', cost: 65, selected: false },
    { name: 'Dinner', cost: 70, selected: false },
  ],
  reducers: {

    // in the paylod we will send the index of the item that would be 
    // toggled and we will update it's state for selection 
    toggleMealSelection: (state, action) => {

      // that suffice to negate the current value of the selection 
      // payload would be the index of the position of the item that we want to 
      // update its state
      state[action.payload].selected = !state[action.payload].selected
    },
  },
});

export const { toggleMealSelection } = mealsSlice.actions;

export default mealsSlice.reducer;
