import RootLayout from "./_components/RootLayout";

export default function Layout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { email: string; isPasswordless: string };
}) {
  const email = searchParams.email ?? "";
  const isPasswordless = searchParams.isPasswordless ?? "";
  return (
    <RootLayout email={email} isPasswordless={isPasswordless}>
      {children}
    </RootLayout>
  );
}
