import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
      <Link href="/" className="font-display font-bold text-h4 text-primary hover:opacity-80 transition-opacity">
        Upright Cultivate
      </Link>
    </header>
  );
}
