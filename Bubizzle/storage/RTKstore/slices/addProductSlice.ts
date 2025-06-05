// storage/RTKstore/slices/addProductSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
}

interface AddProductState {
  title: string;
  description: string;
  price: string;
  location: Location | null;
  locationName: string;
  images: string[]; // image URIs
}

const initialState: AddProductState = {
  title: '',
  description: '',
  price: '',
  location: null,
  locationName: '',
  images: [],
};

const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {
    setAllFields: (state, action: PayloadAction<Partial<AddProductState>>) => {
      Object.assign(state, action.payload);
    },
    updateField: <K extends keyof AddProductState>(
      state: AddProductState,
      action: PayloadAction<{ key: K; value: AddProductState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    resetAddProduct: () => initialState,
  },
});

export const { setAllFields, updateField, resetAddProduct } = addProductSlice.actions;
export default addProductSlice.reducer;
