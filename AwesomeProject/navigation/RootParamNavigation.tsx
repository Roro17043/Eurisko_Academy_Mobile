export type RootStackParamList = {
  // Main app stack
  TabViews: undefined;
  ProductDetails: { productId: string };
  EditProfile: { user: any };
  AddProduct: { location?: { latitude: number; longitude: number } };
  EditProduct: { location?: { latitude: number; longitude: number } };
  LocationPicker: { from: 'AddProduct' | 'EditProduct' };

  // Auth flow
  Login: undefined;
  SignUp: undefined;
  Verification: undefined;
};
