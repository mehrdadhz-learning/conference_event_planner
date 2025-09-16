import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const venueItems = useSelector((state) => state.venue);

  // get the add-on items 
  const avItems = useSelector((state) => state.av);

  // get the meals items 
  const mealsItems = useSelector((state) => state.meals);

  const dispatch = useDispatch();
  const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;


  const handleToggleItems = () => {
    console.log("handleToggleItems called");
    setShowItems(!showItems);
  };

  const handleAddToCart = (index) => {
    if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
      return;
    }
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  // increase the number of the one of the purchased add-ons
  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  // decrease the number of the one of the add-ons
  const handleDecrementAvQuantity = (index) => {
    dispatch(decrementAvQuantity(index));
  };

  // when a meal is selected, what should we do 
  const handleMealSelection = (index) => {
    const item = mealsItems[index];
    if (item.selected && item.type === "mealForPeople") {
      // Ensure numberOfPeople is set before toggling selection
      const newNumberOfPeople = item.selected ? numberOfPeople : 0;
      dispatch(toggleMealSelection(index, newNumberOfPeople));
    }
    else {
      dispatch(toggleMealSelection(index));
    }
  };


  // we have to populate this list, with the items 
  // that have been selected from each category 
  const getItemsFromTotalCost = () => {
    const items = [];

    // go over the items for the venue and add the ones 
    // that they have more quantity to this list 
    venueItems.forEach((item) => {

      // if the quantity of this item is higher than 1, then add it to the list 
      if (item.quantity > 0)

        // take a copy from the dictionary and add a new field for type to it 
        items.push({ ...item, type: 'venue' });
    });


    // go over the items for the add-ons
    avItems.forEach((item) => {

      // if the quantity is higher than 0 and has not been already added to the list
      // then add this item to the list 
      if (item.quantity > 0 && !items.some((i) => i.name === item.name && i.type === "av")) {

        // take a copy from the properties in the list and add a type to the properties 
        items.push({ ...item, type: "av" });
      }
    });


    // go over the meals 
    mealsItems.forEach((item) => {

      // if the meal has been selected 
      if (item.selected) {

        // take a copy of its properties and add the type property as well 
        const itemForDisplay = { ...item, type: "meals" };

        // if there was also a number of people property for that item 
        // add that to the properties as well 
        if (item.numberOfPeople) {
          itemForDisplay.numberOfPeople = numberOfPeople;
        }

        // push the information of the property to the list 
        items.push(itemForDisplay);
      }
    });
    return items;
  };


  // call the function to get the items to be displayed
  const items = getItemsFromTotalCost();


  // this function given the list of items to be displayed, will display them 
  const ItemsDisplay = ({ items }) => {
    console.log(items);
    return <>
      <div className="display_box1">
        {items.length === 0 && <p>No items selected</p>}
        <table className="table_item_data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.cost}</td>
                <td>
                  {item.type === "meals" || item.numberOfPeople
                    ? ` For ${numberOfPeople} people`
                    : item.quantity}
                </td>
                <td>{item.type === "meals" || item.numberOfPeople
                  ? `${item.cost * numberOfPeople}`
                  : `${item.cost * item.quantity}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  };


  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    }
    // if the section that we should compute its total cost is the add-ons
    else if (section == 'av') {

      // we should loop through the add-ons and compute the sum of the price * quantity of each item 
      avItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      })
    }

    // compute the total cost for the meals if we want the cost of the meals 
    else if (section == 'meals') {
      // go over the meals items and multiply the price of each, with the number of the people inserted
      mealsItems.forEach((item) => {

        // if that item is currently selected, then consider it 
        if (item.selected)
          totalCost += item.cost * numberOfPeople
      })
    }
    return totalCost;
  };

  const venueTotalCost = calculateTotalCost("venue");

  // a variable in order to compute the total cost for the add-ons
  const avTotalCost = calculateTotalCost('av');

  // a variable in order to compute the total cost for the meals 
  const mealsTotalCost = calculateTotalCost('meals');

  // an object for storing the details of the total costs 
  // that has all of the costs 
  const totalCosts = {
    venue: venueTotalCost,
    av: avTotalCost,
    meals: mealsTotalCost
  };

  const navigateToProducts = (idType) => {
    if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
      if (showItems) { // Check if showItems is false
        setShowItems(!showItems); // Toggle showItems to true only if it's currently false
      }
    }
  }

  return (
    <>
      <navbar className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
            <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
            <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
          </div>
          <button className="details_button" onClick={() => setShowItems(!showItems)}>
            Show Details
          </button>
        </div>
      </navbar>
      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            <div id="venue" className="venue_container container_main">
              <div className="text">

                <h1>Venue Room Selection</h1>
              </div>
              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>
                    <div className="button_container">
                      {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

                        <>
                          <button
                            className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                          </span>
                          <button
                            className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      ) : (
                        <div className="button_container">
                          <button
                            className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &#8211;
                          </button>
                          <span className="selected_count">
                            {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                          </span>
                          <button
                            className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>


                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: ${venueTotalCost}</div>
            </div>

            {/*Necessary Add-ons*/}
            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1> Add-ons Selection</h1>
              </div>
              <div className="addons_selection">

                {/* we need to create the html tags in order to show the add ons on the webpage*/}
                {avItems.map((item, index) => (
                  <div className="av_data venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text"> {item.name} </div>
                    <div> ${item.cost} </div>
                    <div className="addons_btn">
                      <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}> &ndash; </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className=" btn-success" onClick={() => handleIncrementAvQuantity(index)}> &#43; </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: ${avTotalCost}</div>
            </div>

            {/* Meal Section */}
            <div id="meals" className="venue_container container_main">

              <div className="text">
                <h1>Meals Selection</h1>
              </div>

              {/* a selection for the number of the people */}
              <div className="input-container venue_selection">
                <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  min="1"
                />
              </div>

              {/* show all of the meals to select from */}
              <div className="meal_selection">
                {mealsItems.map((item, index) => (
                  <div className="meal_item" key={index} style={{ padding: 15 }}>
                    <div className="inner">
                      <input type="checkbox" id={`meal_${index}`}
                        checked={item.selected}
                        onChange={() => handleMealSelection(index)}
                      />
                      <label htmlFor={`meal_${index}`}> {item.name} </label>
                    </div>
                    <div className="meal_cost">${item.cost}</div>
                  </div>
                ))}
              </div>

              <div className="total_cost">Total Cost: ${mealsTotalCost}</div>


            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={() => <ItemsDisplay items={items} />} />
          </div>
        )
        };
      </div>
    </>

  );
};


export default ConferenceEvent;