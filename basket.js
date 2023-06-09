import { createAction, createSlice } from "@reduxjs/toolkit";

import BasketService from "../services/basketService";

const basketSlice = createSlice({
  name: "basket",
  initialState: {
    entities: [],
    totalPrice: 0,
    totalQuantity: 0,
    isLoading: true,
    error: null,
  },
  reducers: {
    basketRequested: (state) => {
      state.isLoading = true;
    },
    basketReceved: (state, action) => {
      state.entities = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.totalQuantity = action.payload.totalQuantity;
      state.isLoading = false;
    },
    basketRecevedEmpty: (state) => {
      state.isLoading = false;
    },
    basketRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    //увеличение еденицы товара на один
    addItem(state, action) {
      const findItem = state.entities.find((obj) => obj._id == action.payload);
      if (findItem) {
        findItem.quantity++;
        state.totalPrice += findItem.price;
      }
      state.totalQuantity++;
    },
    //полное удаление еденицы товара
    removeItem(state, action) {
      const findItem = state.entities.find((obj) => obj._id == action.payload);
      state.totalQuantity -= findItem.quantity;
      state.totalPrice -= findItem.price * findItem.quantity;
      state.entities = state.entities.filter(
        (obj) => obj._id !== action.payload
      );
    },
    //уменьшение еденицы товара на один
    minusItem(state, action) {
      const findItem = state.entities.find((obj) => obj._id == action.payload);

      if (findItem) {
        findItem.quantity--;
        state.totalQuantity--;
        state.totalPrice -= findItem.price;
      }
    },
  },
});
const { reducer: basketReducer, actions } = basketSlice;
const {
  basketRequested,
  basketReceved,
  basketRequestFailed,
  basketRecevedEmpty,
  addItem,
  minusItem,
  removeItem,
} = actions;

const updateBasketRequested = createAction("cards/updateBasketRequested");

export const loadBasketList = () => async (dispatch) => {
  dispatch(basketRequested());
  try {
    const { content } = await BasketService.getAll();
    if (content) {
      dispatch(basketReceved(content));
    } else {
      dispatch(basketRecevedEmpty());
    }
  } catch (error) {
    dispatch(basketRequestFailed(error.message));
  }
};
//увеличение еденицы товара на один
export const addBasketItem = (cardId) => async (dispatch) => {
  dispatch(addItem(cardId));
  try {
    await BasketService.increaseOne(cardId);
  } catch (error) {
    console.log(error);
  }
};
//создание корзины
export const createBasket = (cardId) => async (dispatch) => {
  dispatch(updateBasketRequested());
  try {
    const { content } = await BasketService.createBasket(cardId);
    console.log(content);
    if (content) {
      dispatch(basketReceved(content));
      dispatch(addItem(cardId));
    } else {
      dispatch(basketRecevedEmpty());
    }
  } catch (error) {
    console.log(error);
  }
};
//уменьшение еденицы товара на один
export const minusBasketItem = (cardId) => async (dispatch) => {
  dispatch(minusItem(cardId));
  try {
    await BasketService.decreaseOne(cardId);
  } catch (error) {
    console.log(error);
  }
};
//полное удаление еденицы товара
export const removeBasketItem = (cardId) => async (dispatch) => {
  dispatch(removeItem(cardId));
  try {
    await BasketService.delete(cardId);
  } catch (error) {
    console.log(error);
  }
};

export const getBasket = () => async (state) => {
  state.basket;
};
export const getBasketLoadingStatus = () => (state) => state.basket.isLoading;

export default basketReducer;
