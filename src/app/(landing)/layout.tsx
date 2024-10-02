

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section lang="en">
      {/* <Navbar /> */}
      <div className={``}> {children}</div>
    </section>
  );
}
