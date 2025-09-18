export const metadata = {
  title: "Quiet Hours Scheduler",
  description: "Manage your quiet hours",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}

