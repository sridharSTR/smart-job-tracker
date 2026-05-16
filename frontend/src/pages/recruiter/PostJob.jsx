import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import { workplaces } from "../../constants/app";
import { recruiterService } from "../../services/recruiterService";
import { formatApiError } from "../../utils/formatters";

export default function PostJob() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { workplace: "Hybrid", is_active: true } });
  const onSubmit = async (values) => {
    try {
      const details = [
        values.description,
        values.experience ? `Experience: ${values.experience}` : "",
        values.responsibilities ? `Responsibilities:\n${values.responsibilities}` : "",
        values.requirements ? `Requirements:\n${values.requirements}` : "",
        values.deadline ? `Application deadline: ${values.deadline}` : ""
      ].filter(Boolean).join("\n\n");
      await recruiterService.createJob({
        title: values.title,
        company: values.company,
        salary_range: values.salary_range,
        location: values.location,
        workplace: values.workplace,
        description: details,
        is_active: true,
        skill_names: values.skills?.split(",").map((skill) => skill.trim()).filter(Boolean) || []
      });
      toast.success("Job posted.");
      reset();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Post Job" description="Create a validated job post with skills, salary, location, responsibilities, and requirements." />
      <form className="glass grid gap-4 rounded-xl p-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="Job title" {...register("title", { required: true })} />
        <input className="input" placeholder="Company name" {...register("company", { required: true })} />
        <input className="input" placeholder="Salary package" {...register("salary_range")} />
        <input className="input" placeholder="Location" {...register("location", { required: true })} />
        <input className="input" placeholder="Experience required" {...register("experience")} />
        <input className="input" placeholder="Skills required, comma separated" {...register("skills")} />
        <select className="input" {...register("workplace")}>{workplaces.map((item) => <option key={item}>{item}</option>)}</select>
        <input className="input" type="date" placeholder="Application deadline" {...register("deadline")} />
        <textarea className="input min-h-32 md:col-span-2" placeholder="Rich job description" {...register("description", { required: true })} />
        <textarea className="input min-h-28 md:col-span-2" placeholder="Responsibilities" {...register("responsibilities")} />
        <textarea className="input min-h-28 md:col-span-2" placeholder="Requirements" {...register("requirements")} />
        <button className="btn-primary md:col-span-2">Publish job</button>
      </form>
    </>
  );
}
