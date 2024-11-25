import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <div className="m-4 mb-12">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 Metro Vancouver 9-1-1 Service. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link href="/">
              <Button variant="ghost" className="text-md">
                Home
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/form">
              <Button variant="ghost" className="text-md">
                Report
              </Button>
            </Link>
          </li>
          <li>
            <Link href="login">
              <Button variant="ghost" className="text-md">
                Login
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
