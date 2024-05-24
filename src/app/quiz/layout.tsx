
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Presentation",
  description: "Event Quizzes",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full fixed flex items-center justify-center inset-0 overflow-y-auto bg-[#F9FAFF]">{children}</div>
}
