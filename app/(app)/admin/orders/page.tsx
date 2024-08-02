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
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SkeletonSm } from "@/components/common/SkeletonSm";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleGoToOrderItems = (order: BookedTable) => {
    router.push(`orders/${order.id}`);
  };

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
          dateTime: formatDate(table.created_at),
        }));
        setData(fetchedOrders);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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
      {loading ? (
        <div className="">
          <SkeletonSm length={8} />
        </div>
      ) : (
        <Table className=" animated fadeInDown ">
          <TableCaption>A list of your recent Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Id</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {data.map((table) => (
              <TableRow
                key={table.id}
                className="bg-white items-center justify-between w-full cursor-pointer  "
                onClick={() => {
                  handleGoToOrderItems(table);
                }}
              >
                <TableCell>
                  <Image
                    src="/admin/order-1.jpg"
                    alt={table.id.toString()}
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell className="font-medium">{table.id}</TableCell>
                <TableCell className="">{table.email}</TableCell>
                <TableCell className="font-medium">
                  <Badge className="cursor-pointer"> {table.status}</Badge>
                </TableCell>
                <TableCell className="">${table.amount}</TableCell>
                <TableCell className="text-right">{table.dateTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
