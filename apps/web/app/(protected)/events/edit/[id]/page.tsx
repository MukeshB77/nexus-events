export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Edit Event: {params.id}</h1>
    </div>
  );
}
