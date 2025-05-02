import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grow grid-rows-[auto_1fr_auto] items-center justify-items-center gap-12 px-6 py-12 sm:px-20 sm:py-24 bg-gradient-to-b from-[#f1f5f9] to-[#e2e8f0] text-gray-800">
      <main className="row-start-2 flex flex-col items-center gap-8 text-center max-w-xl">
        <Image
          src="/logo1.png" //
          alt="Mindful Journals Logo"
          width={240}
          height={240}
          priority
        />
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to Mindful Journals
        </h1>
        <p className="text-gray-600 text-lg">
          A supportive space to share your thoughts, emotions, and personal stories.
          You are not alone—your voice matters here.
        </p>
        <Link href="/blogs">
          <button className="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 transition">
            Start Journaling
          </button>
        </Link>
      </main>

      <footer className="row-start-3 mt-12 text-sm text-gray-500 text-center">
        Built with compassion 💛 &mdash; Mindful Journals
      </footer>
    </div>
  );
}
