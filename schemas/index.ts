import * as z from "zod";
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png", "/image/jpg", "/image/jpeg"];

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

// export const RegisterSchema = z.object({
//     email:z.string().email({
//         message: "Email is required"
//     }),
//     password:z.string().min(6,{
//         message: "Minimum 6 characters required"
//     }),
//     name:z.string().min(1,{
//         message: "Name is required"
//     })
// });
export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    password_confirmation: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"], // Set the error on the password_confirmation field
  });
function isFile(file: File | undefined | null): file is File {
  return file instanceof File;
}

// Define a schema for the form validation
export const SellerRegisterSchema = z.object({
  // Seller Information
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  about: z
    .string()
    .min(5, { message: "About section must be at least 5 characters" }),
  // .length(500, { message: "About section must be less than 500 characters" }),
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  region: z.string().min(1, { message: "State / Province is required" }),
  postalCode: z.string().min(1, { message: "ZIP / Postal code is required" }),

  // Company Profile
  username: z.string().min(1, { message: "Username is required" }),
  companyName: z.string().min(1, { message: "Company name is required" }),

  //banner image
  // bannerImage: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => {
  //     return !file || file.size <= MAX_UPLOAD_SIZE;
  //   }, "File size must be less than 3MB")
  //   .refine((file) => {
  //     const fileType = file?.name.split(".").pop();
  //     return ACCEPTED_FILE_TYPES.includes(file.type);
  //   }, "File must be a PNG"),
  bannerImage: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!isFile(file)) return false; // Use the type guard function

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension
        ? ACCEPTED_FILE_TYPES.includes(fileExtension)
        : false;
    }, "File must be a PNG"),

  //logo image
  logoImage: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!isFile(file)) return false; // Use the type guard function

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension
        ? ACCEPTED_FILE_TYPES.includes(fileExtension)
        : false;
    }, "File must be a PNG"),

  // File uploads
  // logoFile: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => file.size <= 10 * 1024 * 1024, {
  //     message: "Logo file must be less than 10MB",
  //   })
  //   .refine(
  //     (file) =>
  //       ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
  //         file.type
  //       ),
  //     {
  //       message: "Logo file must be PNG, JPG, JPEG, or GIF",
  //     }
  //   ),

  // bannerFile: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => file.size <= 10 * 1024 * 1024, {
  //     message: "Banner file must be less than 10MB",
  //   })
  //   .refine(
  //     (file) =>
  //       ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
  //         file.type
  //       ),
  //     {
  //       message: "Banner file must be PNG, JPG, JPEG, or GIF",
  //     }
  //   ),
});

export const FoodCategorySchema = z.object({
  food_category_name: z.string().min(1, {
    message: "Category Name is should be least one chracter",
  }),
  food_category_description: z.string().min(1, {
    message: "Category description is should be least one character",
  }),
});

export const WaiterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  phone: z.string().min(1, {
    message: "PhoneNumber is required",
  }),
  profile_image: z.string().optional(),
  password: z
    .string()
    .min(6, {
      message: "Minimum 6 characters required",
    })
    .optional(),
  user_id: z.number(),
});
export const AsignToWaiterSchema = z.object({
  waiter_id: z.number(),
});

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),
  description: z.string().max(1000, "Description is too long"),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().positive("Price must be a positive number")
  ),
  category: z.number().int().min(1, "Category is required"),
  stock: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().int().nonnegative("Stock quantity cannot be negative")
  ),
  //imagePaths: z.array(z.string(), { message: "Each image path must be a valid URL" }).optional(), // Optional because it might not be present initially
});

export const ProductWithImageSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),
  description: z.string().max(1000, "Description is too long"),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().positive("Price must be a positive number")
  ),
  category: z.number().int().min(1, "Category is required"),
  stock: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().int().nonnegative("Stock quantity cannot be negative")
  ),
  imagePaths: z
    .array(z.string(), { message: "Each image path must be a valid URL" })
    .nonempty("At least one image path is required"),
  //imagePaths: z.array(z.string(), { message: "Each image path must be a valid URL" }).optional(), // Optional because it might not be present initially
});

export const cartSchema = z.object({
  product_id: z.string(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs
  cart_qty: z.number().int().positive(), // Ensures quantity is a positive integer
  user_id: z.string(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs
});

export const wishlistSchema = z.object({
  product_id: z.string(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs // Ensures quantity is a positive integer
  user_id: z.string(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs
});

export const getCartSchema = z.object({
  user_id: z.number(), // Adjust type if needed, e.g., z.string().uuid() for UUIDs
});

// Define a schema for validation when image paths are guaranteed

// productImage: z.instanceof(File).optional(),
// export const ProductSchema = z.object({
//   name: z.string().min(1, "Product name is required"),
//   description: z.string().min(1, "Product description is required"),
//   price: z.number().min(0, "Price must be a positive number"),
//  // category: z.string().min(1, "Category is required"),
//  stock: z.number().min(0, "Stock must be a non-negative integer"),
// });

export const formSchema = z.object({
  date: z.string().nonempty("Date is required"),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z
    .string()
    .nonempty("End time is required")
    .refine((val, ctx) => {
      const { startTime } = ctx.parent;
      if (val <= startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be later than start time",
        });
        return false;
      }
      return true;
    }),
});

export const AddTableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
  size_id: z.number().min(1, "Size ID must be a positive number"),
  status_id: z.number().min(1, "Status ID must be a positive number"),
  seats: z.number().min(1, "Seats must be a positive number"),
});
