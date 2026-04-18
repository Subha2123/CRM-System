"use client";

import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useRouter } from "next/navigation";
import { customerService } from "@/src/services/customer";
import { DeleteIcon, EditIcon, LeftArrow } from "@/src/components/Icons";

type Customer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
};



export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const listHeight =
    typeof window !== "undefined" ? window.innerHeight - 260 : 500;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (status) params.append("status", status);

        const res = await customerService.getCustomers(params);
        setCustomers(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debouncedSearch, status]);

  const startEdit = (c: Customer) => {
    setEditingId(c._id);
    setEditForm(c);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      await customerService.updateCustomer(editingId, editForm);
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === editingId ? ({ ...c, ...editForm } as Customer) : c,
        ),
      );

      cancelEdit();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Lead":
        return "bg-blue-100 text-blue-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const Row = ({ index, style }: any) => {
    const c = customers[index];
    const isEditing = editingId === c._id;

    return (
      <div
        style={style}
        className="grid grid-cols-5 gap-4 px-4 py-3 text-sm items-center"
      >
        {isEditing ? (
          <>
            <input
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <input
              value={editForm.email || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
            <input
              value={editForm.company || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, company: e.target.value })
              }
            />
            <select
              value={editForm.status || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <button onClick={saveEdit} className="text-green-600">
                Save
              </button>
              <button onClick={cancelEdit} className="text-gray-500">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div>{c.name}</div>
            <div>{c.email}</div>
            <div>{c.company}</div>
            <div>
              <span
                className={`px-2 py-1 rounded-md ${getStatusStyle(c.status)}`}
              >
                {c.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="text-blue-600">
                {/* Edit */}
                <EditIcon />
              </button>
              <button
                onClick={() => deleteCustomer(c._id)}
                className="text-red-600"
              >
                <DeleteIcon />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-start gap-2 pb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className=""
          >
          <LeftArrow />
          </button>
          <h1 className="text-xl font-bold">Customers List</h1>
          <div />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="border p-2 rounded w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded min-w-37.5"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => router.push("/customers-create")}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg whitespace-nowrap"
          >
            + Create
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-5 gap-4 bg-gray-200 px-4 py-3 text-xs font-semibold uppercase sticky top-0 z-10">
        <div>Name</div>
        <div>Email</div>
        <div>Company</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      <div className="bg-white rounded-b-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-4 animate-pulse">Loading...</p>
        ) : customers.length === 0 ? (
          <p className="p-4 text-gray-500">No customers found</p>
        ) : (
          <List
            height={listHeight}
            itemCount={customers.length}
            itemSize={60}
            width="100%"
            className="font-sans"
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
}
