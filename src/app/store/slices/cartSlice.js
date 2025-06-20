const { createSlice, current } = require("@reduxjs/toolkit");

const initialState = {
    items: [], // arr of cart
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemTocart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((i) => i._id === item._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }
        },
        clearCart: (state, action) => {
            const item = action.payload;
            state.items = item;
        },
        incrementQuantity: (state, action) => {
            const item = state.items.find((i) => i._id === action.payload);
            if (item) item.quantity += 1;
        },
        decrementQuantity: (state, action) => {
            const item = state.items.find((i) => i._id === action.payload);
            if (item?.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter((i) => i._id !== action.payload);
            }
        },
    },
});

export const {
    addItemTocart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
