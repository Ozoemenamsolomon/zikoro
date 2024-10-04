import CreateAppointments from '@/components/appointments/create';
export const dynamic = "force-dynamic";

const EditAppointmentsPage = async ({ searchParams: { alias } }: { searchParams: { [key: string]: string } }) => {
  return (
    <CreateAppointments alias={alias} />
  );
};

export default EditAppointmentsPage;
