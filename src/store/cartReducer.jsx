const initialState = {
  itemsInCart: [{}],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        itemsInCart: [state.itemsInCart, action.payload],
      };
    default:
      return state;
  }
};

export default cartReducer;
