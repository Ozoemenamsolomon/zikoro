export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className=" px-4 pt-[1rem] sm:pt-0 sm:px-6  pb-12">{children}</div>
    </div>
  );
}
