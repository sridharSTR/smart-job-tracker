import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import FilterDropdown from "../../components/common/FilterDropdown";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import StatusTimeline from "../../components/common/StatusTimeline";
import DataTable from "../../components/tables/DataTable";
import Pagination from "../../components/common/Pagination";
import { statuses } from "../../constants/app";
import { userService } from "../../services/userService";
import { formatApiError, pageCount, shortDate, toArray } from "../../utils/formatters";

export default function AppliedJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(() => userService.applications({ page, status: status || undefined, search: query || undefined }).then((res) => {
    const items = toArray(res.data);
    setApplications(items);
    setTotalPages(pageCount(res.data, items.length));
  }).catch(() => setApplications([])), [page, query, status]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [query, status]);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleQuery = (value) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const rows = useMemo(() => applications.filter((item) => (!status || item.status === status) && `${item.company_name} ${item.role_title}`.toLowerCase().includes(query.toLowerCase())), [applications, query, status]);

  const withdraw = async (id) => {
    try {
      await userService.deleteApplication(id);
      toast.success("Application withdrawn.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <>
      <PageHeader eyebrow="User Panel" title="Applied Jobs" description="Search, filter, sort, and track every application status." />
      <div className="glass mb-5 grid gap-3 rounded-xl p-4 md:grid-cols-[2fr_1fr]">
        <SearchBar value={query} onChange={handleQuery} placeholder="Search applications" />
        <FilterDropdown value={status} onChange={setStatus} options={[{ label: "All statuses", value: "" }, ...statuses]} />
      </div>
      <DataTable
        rows={rows}
        empty={<EmptyState title="No applications" description="Apply to jobs or create applications to see them here." />}
        columns={[
          { key: "role_title", label: "Role" },
          { key: "company_name", label: "Company" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "application_date", label: "Applied", render: (row) => shortDate(row.application_date) },
          { key: "timeline", label: "Timeline", render: (row) => <div className="max-w-xl overflow-x-auto"><StatusTimeline current={row.status} /></div> },
          { key: "actions", label: "Actions", render: (row) => <button className="btn-danger" onClick={() => withdraw(row.id)}>Withdraw</button> }
        ]}
      />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
    </>
  );
}
