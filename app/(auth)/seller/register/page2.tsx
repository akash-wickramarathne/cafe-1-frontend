"use client";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState, useTransition } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid/index.js";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { z } from "zod";
import { SellerRegisterSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function SellerRegister() {
  const { showNotification } = useNotification();
  // const navigator = useNavigate();
  const fname = useRef<HTMLInputElement>(null);
  const lname = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const sellerAbout = useRef<HTMLTextAreaElement>(null);
  const streetAddress = useRef<HTMLInputElement>(null);
  const city = useRef<HTMLInputElement>(null);
  const province = useRef<HTMLInputElement>(null);
  const zipCode = useRef<HTMLInputElement>(null);
  const companyUsername = useRef<HTMLInputElement>(null);
  const companyName = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [rejected, setRejected] = useState<File[]>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{
    companyLogo: string;
    companyBanner: string;
  }>({
    companyLogo: "",
    companyBanner: "",
  });
  const [accountCreating, setAccountCreating] = useState<boolean>(false);
  const form = useForm<z.infer<typeof SellerRegisterSchema>>({
    resolver: zodResolver(SellerRegisterSchema),
    // defaultValues: {
    //   email: "",
    //   password: "",
    // },
  });
  const [isPending, startTransition] = useTransition();

  const submitForm = async (data: z.infer<typeof SellerRegisterSchema>) => {
    setAccountCreating(true);
    // const bannerUrl = await handleUploadImages("banner");
    // const logoUrl = await handleUploadImages("logo");

    // setImageUrls({
    //   companyLogo: logoUrl || "",
    //   companyBanner: bannerUrl || "",
    // });

    // const formData = {
    //   fname: fname.current?.value || "",
    //   lname: lname.current?.value || "",
    //   email: email.current?.value || "",
    //   sellerAbout: sellerAbout.current?.value || "",
    //   streetAddress: streetAddress.current?.value || "",
    //   city: city.current?.value || "",
    //   province: province.current?.value || "",
    //   zipCode: zipCode.current?.value || "",
    //   companyName: companyName.current?.value || "",
    //   companyUsername: companyUsername.current?.value || "",
    //   companyLogo: imageUrls.companyLogo,
    //   companyBanner: imageUrls.companyBanner,
    // };

    console.log(data);
    // You can send formData to your API here

    setAccountCreating(false);
  };

  const handleDrop = (type: "logo" | "banner") => (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith("image")) {
        if (type === "logo") {
          setLogoFile(file);
        } else {
          setBannerFile(file);
        }
      } else {
        setRejected((prev) => [...prev, file]);
      }
    }
  };

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: handleDrop("logo"),
    });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
  } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop("banner"),
  });

  useEffect(() => {
    if (bannerFile) {
      URL.revokeObjectURL(bannerFile.preview);
    }
  }, [bannerFile]);

  useEffect(() => {
    if (logoFile) {
      URL.revokeObjectURL(logoFile.preview);
    }
  }, [logoFile]);

  const handleUploadImages = async (
    imageType: "banner" | "logo"
  ): Promise<string | null> => {
    const formData = new FormData();

    if (imageType === "banner") {
      if (!bannerFile) {
        showNotification("Error", "No Image selected");
        return null;
      }

      formData.append("banner", bannerFile);

      //   try {
      //     const response = await axiosClient.post<{ path: string }>(
      //       "/seller/store/sellerBanner",
      //       formData
      //     );
      //     return response.data.path;
      //   } catch (error) {
      //     console.error("Error uploading banner image:", error.message);
      //     showNotification("Error", "Failed to upload banner image");
      //     return null;
      //   }
    } else if (imageType === "logo") {
      if (!logoFile) {
        showNotification("Error", "No Logo selected");
        return null;
      }

      formData.append("logo", logoFile);

      //   try {
      //     const response = await axiosClient.post<{ path: string }>(
      //       "/seller/store/sellerLogo",
      //       formData
      //     );
      //     return response.data.path;
      //   } catch (error) {
      //     console.error("Error uploading logo image:", error.message);
      //     showNotification("Error", "Failed to upload logo image");
      //     return null;
      //   }
    }

    return null;
  };

  return (
    <div className="h-max">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="example@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Tell Something about you"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Add Your Personal Address"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-12">
            Company Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly, so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="@test"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="col-span-full">
              <label
                htmlFor="logo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div
                  {...getLogoRootProps()}
                  className="w-24 rounded-full ring ring-primary flex justify-center items-center cursor-pointer"
                >
                  <FormField
                    control={form.control}
                    name="logoImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            {...getLogoInputProps()}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <input {...getLogoInputProps()} /> */}
                  {logoFile ? (
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt={logoFile.name}
                      onLoad={() =>
                        URL.revokeObjectURL(URL.createObjectURL(logoFile))
                      }
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <PhotoIcon
                      className="m-5 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>

            <section className="col-span-full mt-12">
              <p className="text-2xl font-semibold">Cover Photo</p>
              <div {...getBannerRootProps()} className="mt-4">
                <FormField
                  control={form.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          {...getBannerInputProps()}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {bannerFile ? (
                      <div className="relative h-32 rounded-md shadow-lg flex justify-center items-center">
                        <img
                          src={URL.createObjectURL(bannerFile)}
                          alt={bannerFile.name}
                          onLoad={() =>
                            URL.revokeObjectURL(URL.createObjectURL(bannerFile))
                          }
                          className="h-max max-w-52 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setBannerFile("")}
                          className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5 fill-black hover:fill-secondary-400 transition-colors" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={accountCreating}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {accountCreating ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                <p>Request</p>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
