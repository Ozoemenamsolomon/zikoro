

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section lang="en">
      <div className={``}> {children}</div>
    </section>
  );
}
