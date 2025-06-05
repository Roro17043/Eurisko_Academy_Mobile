// editProductSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
}

interface EditProductState {
  productId: string | null;
  title: string;
  description: string;
  price: string;
  location: Location | null;
  locationName: string;
  images: string[]; // paths or URLs
}

const initialState: EditProductState = {
  productId: null,
  title: '',
  description: '',
  price: '',
  location: null,
  locationName: '',
  images: [],
};

const editProductSlice = createSlice({
  name: 'editProduct',
  initialState,
  reducers: {
    setAllFields: (state: EditProductState, action: PayloadAction<Partial<EditProductState>>) => {
      Object.assign(state, action.payload);
    },
    resetEditProduct: (state: EditProductState) => {
      Object.assign(state, initialState);
    },
    updateField: <K extends keyof EditProductState>(
      state: EditProductState,
      action: PayloadAction<{ key: K; value: EditProductState[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});


export const { setAllFields, resetEditProduct, updateField } = editProductSlice.actions;
export default editProductSlice.reducer;
