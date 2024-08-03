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

export type BookedTable = {
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

  const fetchBookTables = async () => {
    try {
      const response = await axios.get("/api/admin/get/book-tables");
      const data = response.data;

      if (data.success) {
        const fetchedBookedTables: BookedTable[] = data.data.map(
          (table: any) => ({
            id: table.id,
            name: table.user.name,
            email: table.user.email,
            status: table.status,
            amount: table.payment,
          })
        );
        setData(fetchedBookedTables);
      } else {
        console.error("Failed to fetch tables:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching tables:", error);
    }
  };

  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.get("/api/get/waiters");
        setWaiters(response.data.data);
      } catch (error) {
        console.error("Failed to fetch waiters:", error);
        showNotification("Error", "Failed to load waiters.");
      }
    };

    fetchWaiters();
  }, []);

  useEffect(() => {
    fetchBookTables();
  }, []);

  const handleAssignWaiter = (table: BookedTable) => {
    setSelectedTable(table);
    setSelectedWaiter(null); // Reset selected waiter when assigning a new table
  };

  const handleSelectChange = (value: string) => {
    const selectedId = parseInt(value);
    setSelectedWaiter(selectedId);
  };

  const handleSave = async () => {
    if (selectedTable && selectedWaiter !== null) {
      try {
        await axios.post("/api/admin/assign-waiter", {
          tableId: selectedTable.id,
          waiterId: selectedWaiter,
        });
        showNotification("Success", "Waiter assigned successfully.");
        setSelectedTable(null);
        setSelectedWaiter(null);
        fetchBookTables();
      } catch (error) {
        console.error("Failed to assign waiter:", error);
        showNotification("Error", "Failed to assign waiter.");
      }
    } else {
      showNotification("Warning", "Please select a table and a waiter.");
    }
  };

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
              <TableCell className="flex gap-4">
                <Button onClick={() => handleAssignWaiter(table)}>
                  Assign a Waiter
                </Button>
                {selectedTable?.id === table.id && (
                  <div>
                    <Select
                      onValueChange={handleSelectChange}
                      value={
                        selectedWaiter !== null ? String(selectedWaiter) : ""
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign a waiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Assign a waiter</SelectLabel>
                          {waiters.map((waiter) => (
                            <SelectItem
                              value={waiter.id.toString()}
                              key={waiter.id}
                            >
                              {waiter.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSave} className="mt-2">
                      Save
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">${table.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
