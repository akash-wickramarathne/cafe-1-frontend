"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotification } from "@/app/_contexts/NotificationContext";

export type OrdersTable = {
  id: string;
  name: string;
  email: string;
  status: {
    order_status_name: string;
  } | null;
  amount: string;
};

export type Waiter = {
  id: number;
  name: string;
  email: string;
};

export default function DataTableDemo() {
  const [data, setData] = useState<BookedTable[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [selectedWaiter, setSelectedWaiter] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<BookedTable | null>(null);
  const { showNotification } = useNotification();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/get/orders");
      const data = response.data;

      if (data.success) {
        const fetchedOrders: BookedTable[] = data.data.map((table: any) => ({
          id: table.order_id,
          name: table.user.name,
          email: table.user.email,
          status: table.status.order_status_name,
          amount: table.total_amount,
        }));
        setData(fetchedOrders);
      } else {
        console.error("Failed to fetch tables:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching tables:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead className="w-[100px]">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((table) => (
            <TableRow key={table.id}>
              <TableCell className="font-medium">{table.id}</TableCell>
              <TableCell className="font-medium">{table.email}</TableCell>
              <TableCell className="flex gap-4">{table.status}</TableCell>
              <TableCell className="text-right">${table.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
