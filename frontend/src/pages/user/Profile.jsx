import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { formatApiError } from "../../utils/formatters";

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: user });

  const onSubmit = async (values) => {
    try {
      const { data } = await userService.updateProfile(values);
      setUser(data);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <>
      <PageHeader eyebrow="User Panel" title="Profile" description="Manage profile picture, skills, experience, education, and portfolio links." />
      <form className="glass grid gap-4 rounded-xl p-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="First name" {...register("first_name")} />
        <input className="input" placeholder="Last name" {...register("last_name")} />
        <input className="input" placeholder="Email" type="email" {...register("email")} />
        <input className="input" placeholder="Username" {...register("username")} />
        <input className="input" placeholder="LinkedIn URL" {...register("linkedin_url")} />
        <input className="input" placeholder="GitHub URL" {...register("github_url")} />
        <input className="input md:col-span-2" placeholder="Portfolio URL" {...register("portfolio_url")} />
        <textarea className="input min-h-28 md:col-span-2" placeholder="Skills management" {...register("bio")} />
        <textarea className="input min-h-28 md:col-span-2" placeholder="Experience section" {...register("experience")} />
        <textarea className="input min-h-28 md:col-span-2" placeholder="Education section" {...register("education")} />
        <button className="btn-primary md:col-span-2">Save profile</button>
      </form>
    </>
  );
}

