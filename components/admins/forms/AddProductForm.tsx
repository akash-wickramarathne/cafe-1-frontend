// "use client";
// import React, { useState, useTransition } from "react";
// import {
//   Bird,
//   Book,
//   Bot,
//   Code2,
//   CornerDownLeft,
//   LifeBuoy,
//   Mic,
//   Paperclip,
//   Rabbit,
//   Settings,
//   Settings2,
//   Share,
//   SquareTerminal,
//   SquareUser,
//   Triangle,
//   Turtle,
// } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { FormProvider, useForm } from "react-hook-form";
// import { z } from "zod";
// import { ProductSchema } from "@/schemas";
// import { zodResolver } from "@hookform/resolvers/zod";
// import FileUpload from "../drag-and-drop-component";
// import { storeProductImage } from "@/app/api/saveProductImge";

// export const AddProductForm = () => {
//   const [isPending, setIsPending] = useState(false);
//   const [productImages, setProductImages] = useState<File[]>([]);

//   const formMethods = useForm({
//     resolver: zodResolver(ProductSchema),
//   });

//   const { handleSubmit, control, setValue } = formMethods;

//   const submitForm = async (data: any) => {
//     // Ensure price and stock are numbers
//     data.price = parseFloat(data.price);
//     data.stock = parseInt(data.stock, 10);

//     const formData = new FormData();
//     Object.keys(data).forEach((key) => formData.append(key, data[key]));

//     // Include product images in the formData
//     productImages.forEach((file, index) => {
//       formData.append(`images[${index}]`, file);
//     });

//     try {
//       console.log("Submitting form...");
//       setIsPending(true);

//       // Submit form data to the API endpoint
//       const result = await storeProductImage(productImages);
//       console.log("Response:", result);

//       // Handle successful response
//       console.log("Images uploaded successfully:", result.paths);
//     } catch (error) {
//       // Handle error
//       console.error("Submission error:", error);
//     } finally {
//       setIsPending(false);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <main className="grid flex-1 gap-4 overflow-auto ">
//         <div className="relative hidden flex-col items-start gap-8 md:flex">
//           <FormProvider {...formMethods}>
//             <form
//               onSubmit={handleSubmit(submitForm)}
//               className="grid w-full items-start bg-white gap-6 "
//             >
//               <fieldset className="gap-6 rounded-lg border p-4 grid grid-cols-2 ">
//                 <div>
//                   <legend className="-ml-1 px-1 text-sm font-medium">
//                     Features
//                   </legend>
//                   <div className="grid gap-3">
//                     <FormField
//                       control={control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product Name</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={isPending}
//                               placeholder="Food"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div className="grid gap-3">
//                     <FormField
//                       control={control}
//                       name="description"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product Description</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               {...field}
//                               disabled={isPending}
//                               placeholder="Type Something about product"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div className="grid gap-3">
//                     <FormField
//                       control={control}
//                       name="price"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product Price</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={isPending}
//                               placeholder=""
//                               type="number"
//                               min="0"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div className="grid gap-3">
//                     <FormField
//                       control={control}
//                       name="stock"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product Stock</FormLabel>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={isPending}
//                               placeholder=""
//                               type="number"
//                               min="0"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid gap-3">
//                   <FormLabel>Product Image</FormLabel>
//                   <FileUpload onFilesUpload={setProductImages} />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full mt-2"
//                   disabled={isPending}
//                 >
//                   {isPending ? "Saving..." : "Save"}
//                 </Button>
//               </fieldset>
//             </form>
//           </FormProvider>
//         </div>
//       </main>
//     </div>
//   );
// };
