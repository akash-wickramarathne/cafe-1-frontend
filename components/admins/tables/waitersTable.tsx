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
type WaitersTableProps = {
  waiters: Waiter[];
};

export function WaitersTable({ waiters }: WaitersTableProps) {
  return (
    <Table>
      {/* <TableCaption>A list of Waiters.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {waiters.map((waiter) => (
          <TableRow key={waiter.id}>
            <TableCell className="font-medium">{waiter.id}</TableCell>
            <TableCell>{waiter.name}</TableCell>
            <TableCell>{waiter.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
