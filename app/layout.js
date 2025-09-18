// app/layout.js
import { Analytics } from "@vercel/analytics/next"
export const metadata = {
  title: "Quiet Hours Scheduler",
  description: "Manage your quiet hours",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
      <Analytics/>
    </html>
  );
}
