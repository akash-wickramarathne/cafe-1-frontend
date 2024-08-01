// Define the type for registration props
type RegisterProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type AddFoodCategoryProps = {
  onSave: (data: { name: string; description: string }) => Promise<void>; // Save function
  onAfterSave?: () => void; // Callback function after saving
};

type AddFoodCategoryComponentProps = {
  values: {
    food_category_name: string;
    food_category_description: string;
  };
  onChange: (field: string, value: string) => void;
};

// export type ErrorResponse {
//   message?: string;
//   errors?: any;
// }

// export interface AxiosError {
//   response?: {
//     data?: ErrorResponse;
//   };
// }

type FoodCategoryPropsAdminSide = {
  category: string;
  description: string;
  id: string | number;
};

type Category = {
  id: number;
  name: string;
  totalItems: number;
};

type Waiter = {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  password?: string;
};

type BookedTable = {
  id: number;
  start_time:string;
  end_time:string;
  book_date:string;
  waiter_id:string;
  payment:number;
  status:number;
  user_id:string;
};
type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  category: number;
  stock: number;
  imagePaths: string[]; // Allows empty arrays
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  foodImages: string[];
  category: Category;
}

interface CartItem {
  id: number;
  cart_qty: number;
  user_id: number;
  product: Product;
}
