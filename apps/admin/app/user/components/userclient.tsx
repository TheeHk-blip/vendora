"use client";

import { UsePage } from "@/app/hooks/usePage";
import { Table } from "@vendora/ui";
import { Header } from "./header";
import type { SortDirection, Users } from "@vendora/ui";
import { useState } from "react";
import { useMemo } from "react";

interface UserProps {
  users: Users[]
}

export default function UserClient({ users }: UserProps) {
  const { page, setPage } = UsePage();
  const [sortKey, setSortKey] = useState<keyof Users>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA)
      }

      return 0;
    })
  }, [users, sortKey, sortDirection]);

  return(
    <Table 
      header={
        <Header 
          handleSort={(key, direction) => {
            setSortKey(key as keyof Users);
            setSortDirection(direction);
          }} 
        />
      }
      columns={[
        { key: "name", title: "Name" },
        { key: "email", title: "Email" },
        { key: "role", title: "Role" },
      ]}
      data={sortedUsers}
      rowKey={"_id"}
      page={page}
      pageSize={10}
      onPageChange={setPage}
    />
  )
}