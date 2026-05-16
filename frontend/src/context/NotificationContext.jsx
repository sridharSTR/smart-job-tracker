import { createContext, useCallback, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { notificationService } from "../services/notificationService";
import { toArray } from "../utils/formatters";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await notificationService.list();
      setNotifications(toArray(data));
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id) => {
    await notificationService.markRead(id);
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
    toast.success("Notification marked read.");
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      loading,
      unreadCount: notifications.filter((item) => !item.is_read).length,
      loadNotifications,
      markRead
    }),
    [loadNotifications, loading, markRead, notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
