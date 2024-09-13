import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex justify-around">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/send">Send</Link>
        </li>
        <li>
          <Link href="/receive">Receive</Link>
        </li>
      </ul>
    </nav>
  );
}
