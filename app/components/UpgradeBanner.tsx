import Link from "next/link";

export default function UpgradeBanner() {
  return (
    <div className="bg-teal-300 text-right p-2 text-black flex items-center justify-center">
      <p>Become a</p>

      <div className="relative flex items-center mx-2">
        <div className="bg-teal-600 py-3 absolute w-full rounded-md animate-ping-slow opacity-90 duration-100"></div>
        <Link
          href="/upgrade"
          className="font-bold bg-slate-700 text-white rounded-md hover:text-teal-300 relative block p-1"
        >
          <span>PRO RIDER</span>
        </Link>
      </div>

      <p>!</p>
    </div>
  );
}
