import { AdminEmployeeEditView } from "@/views/AdminEmployeeEditView";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <AdminEmployeeEditView params={params} />;
}
