import './globals.css'

export const metadata = {
  title: 'Quiet Hours Scheduler',
  description: 'Manage your silent-study blocks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
