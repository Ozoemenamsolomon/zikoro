
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Event Quizzes",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full">{children}</div>
}
