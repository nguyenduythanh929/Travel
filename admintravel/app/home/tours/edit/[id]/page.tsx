import EditTourForm from "@/components/tour-edit/EditTourForm";

interface EditTourPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTourPage({ params }: EditTourPageProps) {
  const { id } = await params;

  return (
    <>
      <h1 className="box-title">Chỉnh sửa tour</h1>
      <EditTourForm tourId={parseInt(id)} />
    </>
  );
}
