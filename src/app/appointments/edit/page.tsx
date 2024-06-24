import CreateAppointments from '@/components/appointments/create'

const EditAppointmentsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] } }) => {
  /**
   const {data,error} = await supabaseServerClient
                              .from('appointmentLinks')
                              .select('*')
                              .eq('id', searchParams?.d)
                              .single()

                              console.log({data})
   */
  const data = "" as any
  return (
    <CreateAppointments editData={data}/>
  )
}

export default EditAppointmentsPage
