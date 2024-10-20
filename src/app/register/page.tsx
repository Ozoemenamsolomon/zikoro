import RegisterPage from "./_components/RegisterPage";

export default function Page({
  searchParams: { userEmail },
}: {
  searchParams: { userEmail: string };
}) {
  return <RegisterPage emailParam={userEmail} />;
}
