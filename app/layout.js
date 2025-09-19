import Listener from "@/components/Listener";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Listener />  {/* 👈 runs in background */}
      </body>
    </html>
  );
}
