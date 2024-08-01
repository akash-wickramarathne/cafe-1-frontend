"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";



// Define the props for the FoodCategoiresTable component
type FoodCategoiresTableProps = {
  categories: Category[];
};

export function FoodCategoiresTable({ categories }: FoodCategoiresTableProps) {
  return (
    <Table>
      <TableCaption>A list of food categories.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Total Items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.totalItems}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
