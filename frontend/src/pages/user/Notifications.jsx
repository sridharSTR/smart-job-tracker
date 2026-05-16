import { useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { shortDate } from "../../utils/formatters";

export default function Notifications() {
  const { notifications, loadNotifications, markRead } = useNotifications();
  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  return (
    <>
      <PageHeader eyebrow="User Panel" title="Notifications" description="Interview reminders, deadline alerts, and system updates." />
      <div className="space-y-3">
        {notifications.map((item) => (
          <div className="glass flex flex-col gap-3 rounded-xl p-4 md:flex-row md:items-center md:justify-between" key={item.id}>
            <div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.message}</p><p className="mt-2 text-xs text-slate-400">{shortDate(item.created_at)}</p></div>
            <button className="btn-soft" disabled={item.is_read} onClick={() => markRead(item.id)}>{item.is_read ? "Read" : "Mark read"}</button>
          </div>
        ))}
      </div>
      {!notifications.length && <EmptyState title="No notifications" description="Unread badges and reminders will appear here." />}
    </>
  );
}
