import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex justify-center my-10 mx-3">
      <div className="bg-slate-500 rounded-lg p-5 w-full md:w-1/2 text-center">
        <h1 className="text-xl font-bold">You are now a PRO rider! 🤙🏻</h1>
        <p className="my-2">Thank you for upgrading</p>
        <Link href="/" className="underline hover:shadow-xl">
          Let's add more bikes!
        </Link>
      </div>
    </div>
  );
}
