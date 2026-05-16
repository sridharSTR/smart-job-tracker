export default function FilterDropdown({ value, onChange, options, label = "Filter" }) {
  return (
    <select className="input" aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value ?? option} value={option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </select>
  );
}

