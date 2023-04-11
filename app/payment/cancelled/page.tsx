import Link from "next/link";

export default function CancelledPage() {
  return (
    <div className="flex justify-center my-10 mx-3">
      <div className="bg-slate-500 rounded-lg p-5 w-full md:w-1/2 text-center">
        <h1 className="text-xl font-bold">Payment was canceled 🥲</h1>
        <p className="my-2">Please try again</p>
        <Link href="/" className="underline hover:shadow-xl">
          Go home
        </Link>
      </div>
    </div>
  );
}
