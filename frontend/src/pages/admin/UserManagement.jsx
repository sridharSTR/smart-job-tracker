import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/modals/Modal";
import { adminService } from "../../services/adminService";
import { formatApiError, toArray } from "../../utils/formatters";

export default function UserManagement({ roleFilter, title = "User Management", eyebrow = "Admin Panel" }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const load = () => adminService.users().then((res) => setUsers(toArray(res.data))).catch(() => setUsers([]));
  useEffect(() => { load(); }, []);
  const rows = users.filter((user) => (!roleFilter || user.role === roleFilter) && `${user.username} ${user.email}`.toLowerCase().includes(query.toLowerCase()));

  const suspend = async (id) => {
    try {
      await adminService.suspendUser(id);
      toast.success("User status updated.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description="Search, filter, suspend, activate, delete, change role, and inspect users." />
      <div className="glass mb-5 rounded-xl p-4"><SearchBar value={query} onChange={setQuery} placeholder="Search users" /></div>
      <DataTable rows={rows} empty={<EmptyState title="No users found" />} columns={[
        { key: "username", label: "User" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "is_suspended", label: "Status", render: (row) => row.is_suspended ? "Suspended" : "Active" },
        { key: "actions", label: "Actions", render: (row) => <div className="flex gap-2"><button className="btn-soft" onClick={() => setSelected(row)}>Details</button><button className="btn-danger" onClick={() => suspend(row.id)}>{row.is_suspended ? "Activate" : "Suspend"}</button></div> }
      ]} />
      <Modal open={Boolean(selected)} title="User Details" onClose={() => setSelected(null)}>{selected && <pre className="overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-white">{JSON.stringify(selected, null, 2)}</pre>}</Modal>
    </>
  );
}

