export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Quiet Hours Scheduler</h1>
      <nav>
        <ul className="flex gap-4">
          <li>
            <a href="/auth" className="hover:underline">
              Login / Signup
            </a>
          </li>
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
