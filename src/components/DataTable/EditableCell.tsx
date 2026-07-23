import type { Employee } from "../../types/table";

type Props = {
  row: Employee;
  field: keyof Employee;
  type?: "text" | "number";
  value: string | number;
  editing: boolean;
  onChange: (field: keyof Employee, value: string) => void;
};

export function EditableCell({
  row,
  field,
  type = "text",
  value,
  editing,
  onChange,
}: Props) {
  if (!editing)
    return (
      <>{field === "salary" ? `$${Number(value).toLocaleString()}` : value}</>
    );
  return (
    <input
      aria-label={`${String(field)} for ${row.name}`}
      type={type}
      value={value}
      onChange={(event) => onChange(field, event.target.value)}
    />
  );
}
