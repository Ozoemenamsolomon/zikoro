import { Suspense } from "react";
import RootLayout from "./_components/RootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RootLayout>{children}</RootLayout>
    </Suspense>
  );
}
