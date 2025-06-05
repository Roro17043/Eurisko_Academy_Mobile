export type RootStackParamList = {
  TabViews: undefined;
  ProductDetails: { productId: string };
  EditProfile: { user: any };
  EditProduct: { productId: string; location?: { latitude: number; longitude: number }; from?: 'MyProducts' | 'ProductDetails' };
  AddProduct: { location?: { latitude: number; longitude: number } };
  LocationPicker: { from: 'EditProduct' | 'AddProduct'; productId?: string,  };
  Login: undefined;
  SignUp: undefined;
  Verification: undefined;
  Splash: undefined;
};
