import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader.jsx";
import api from "../services/api.js";

export default function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { status: "Applied", workplace: "Remote", application_date: new Date().toISOString().slice(0, 10) } });

  useEffect(() => {
    if (id) api.get(`/applications/${id}/`).then((res) => reset(res.data));
  }, [id, reset]);

  const onSubmit = async (values) => {
    if (id) await api.put(`/applications/${id}/`, values);
    else await api.post("/applications/", values);
    navigate("/applications");
  };

  return (
    <>
      <PageHeader title={id ? "Edit application" : "Add application"} eyebrow="Pipeline details" />
      <form className="glass grid gap-5 rounded-lg p-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Company name"><input className="input" {...register("company_name", { required: true })} /></Field>
        <Field label="Role title"><input className="input" {...register("role_title", { required: true })} /></Field>
        <Field label="Salary offered"><input className="input" type="number" step="0.01" {...register("salary_offered")} /></Field>
        <Field label="Location"><input className="input" {...register("location")} /></Field>
        <Field label="Job type"><input className="input" placeholder="Full-time, Internship, Contract" {...register("job_type")} /></Field>
        <Field label="Work mode">
          <select className="input" {...register("workplace")}>{["Remote", "Hybrid", "Onsite"].map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Application date"><input className="input" type="date" {...register("application_date", { required: true })} /></Field>
        <Field label="Interview date"><input className="input" type="datetime-local" {...register("interview_date")} /></Field>
        <Field label="Status">
          <select className="input" {...register("status")}>{["Applied", "OA", "Shortlisted", "Interview", "HR Round", "Rejected", "Offer"].map((item) => <option key={item}>{item}</option>)}</select>
        </Field>
        <Field label="Deadline"><input className="input" type="datetime-local" {...register("deadline")} /></Field>
        <div className="md:col-span-2">
          <Field label="Notes"><textarea className="input min-h-32" {...register("notes")} /></Field>
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary"><Save size={17} /> Save application</button>
        </div>
      </form>
    </>
  );
}

function Field({ label, children }) {
  return <label className="space-y-2"><span className="label">{label}</span>{children}</label>;
}
