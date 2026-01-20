import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mb-8 text-xl text-gray-600">Prompt trend not found</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
