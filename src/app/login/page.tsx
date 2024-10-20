import LoginComponent from "./_components/LoginForm";

export default function LoginPage({
  searchParams: { redirectedFrom },
}: {
  searchParams: { redirectedFrom: string };
}) {
  return <LoginComponent redirectedFrom={redirectedFrom} />;
}
