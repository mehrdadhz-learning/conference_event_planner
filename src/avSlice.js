import { createSlice } from "@reduxjs/toolkit";


// put the initial values for the add-ons on the webpage
export const avSlice = createSlice({
  name: "av",

  // we will name this slice as av for add-ons and put the initial information that we want to carry 
  // from each add-on
  initialState: [
    {
      img: "https://pixabay.com/images/download/business-20031_640.jpg",
      name: "Projectors",
      cost: 200,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/speakers-4109274_640.jpg",
      name: "Speaker",
      cost: 35,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/public-speaking-3926344_640.jpg",
      name: "Microphones",
      cost: 45,
      quantity: 0,
    },
    {
      img: "https://pixabay.com/images/download/whiteboard-2903269_640.png",
      name: "Whiteboards",
      cost: 80,
      quantity: 0,
    },

    {
      img: "https://pixabay.com/images/download/signpost-235079_640.jpg",
      name: "Signage",
      cost: 80,
      quantity: 0,
    },
  ],


  // implement the reducers for changing the add-ons states
  reducers: {


    // the function to increase the quantity of a specific item 
    incrementAvQuantity: (state, action) => {

      // first retrieve the item itself
      const item = state[action.payload]

      // if such item exists, then we will increase the quantity of it 
      if (item)
        item.quantity += 1;

    },

    // this function will decrease the quantity of an item 
    decrementAvQuantity: (state, action) => {

      // first find the item 
      const item = state[action.payload]

      // check if the item exists and also its quantity is higher than 0 
      if (item && item.quantity > 0)
        item.quantity -= 1
    },
  },
});

export const { incrementAvQuantity, decrementAvQuantity } = avSlice.actions;

export default avSlice.reducer;
