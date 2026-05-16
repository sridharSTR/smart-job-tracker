import { CheckCheck, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import api from "../services/api.js";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const loadNotifications = () => {
    api.get("/notifications/").then((res) => setItems(res.data.results || res.data)).catch(() => setItems(sample));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const sendNotification = async (values) => {
    try {
      setError("");
      setMessage("");
      await api.post("/notifications/", values);
      reset();
      setMessage(`Message sent to ${values.recipient_email}.`);
      loadNotifications();
    } catch (err) {
      setError(formatApiError(err) || "Could not send this message.");
    }
  };

  return (
    <>
      <PageHeader title="Notifications" eyebrow="Reminders" />
      <form className="glass mb-5 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit(sendNotification)}>
        <input className="input" placeholder="User email" type="email" {...register("recipient_email", { required: true })} />
        <input className="input" placeholder="Title" {...register("title", { required: true })} />
        <button className="btn-primary md:row-span-2" disabled={isSubmitting}>
          <Send size={17} /> {isSubmitting ? "Sending" : "Send"}
        </button>
        <textarea className="input min-h-24 md:col-span-2" placeholder="Message" {...register("message", { required: true })} />
      </form>
      {message && <p className="mb-4 rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">{message}</p>}
      {error && <p className="mb-4 text-sm font-semibold text-coral">{error}</p>}
      {items.length === 0 ? <EmptyState title="Nothing pending" description="Interview reminders and application deadlines will show up here." /> : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass flex items-center justify-between rounded-lg p-4">
              <div>
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.message}</p>
              </div>
              <button className="btn-soft !px-3"><CheckCheck size={17} /></button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const sample = [{ id: 1, title: "Interview tomorrow", message: "Prepare system design notes for the Frontend Engineer interview." }];

function formatApiError(err) {
  const data = err?.response?.data;
  if (!data) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(" ");
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`)
    .join(" ");
}
