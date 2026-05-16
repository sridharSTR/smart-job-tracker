import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const onSubmit = async (values) => {
    const { data } = await api.patch("/auth/me/", values);
    setUser(data);
  };

  return (
    <>
      <PageHeader title="Profile" eyebrow="Career identity" />
      <form className="glass grid gap-5 rounded-lg p-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="First name" {...register("first_name")} />
        <input className="input" placeholder="Last name" {...register("last_name")} />
        <input className="input" placeholder="Email" type="email" {...register("email")} />
        <input className="input" placeholder="Username" {...register("username")} />
        <textarea className="input min-h-32 md:col-span-2" placeholder="Skills section" {...register("bio")} />
        <textarea className="input min-h-32 md:col-span-2" placeholder="Experience section" {...register("experience")} />
        <textarea className="input min-h-32 md:col-span-2" placeholder="Education section" {...register("education")} />
        <button className="btn-primary md:col-span-2"><Save size={17} /> Save profile</button>
      </form>
    </>
  );
}
