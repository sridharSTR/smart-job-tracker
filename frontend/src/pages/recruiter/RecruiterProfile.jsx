import PageHeader from "../../components/common/PageHeader";

export default function RecruiterProfile() {
  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Recruiter Profile" description="Manage recruiter photo, company logo, company details, industry, website, and description." />
      <form className="glass grid gap-4 rounded-xl p-5 md:grid-cols-2">
        <input className="input" placeholder="Recruiter name" /><input className="input" placeholder="Company name" /><input className="input" placeholder="Industry" /><input className="input" placeholder="Website" /><textarea className="input min-h-32 md:col-span-2" placeholder="Company description" /><button className="btn-primary md:col-span-2">Save recruiter profile</button>
      </form>
    </>
  );
}
