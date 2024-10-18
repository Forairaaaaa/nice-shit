import Link from "next/link";

export default function Home() {
  return (
    <center className="p-12 space-y-5">
      <Link className="text-5xl font-serif" href={"/gallery-wall"}>
        Gallery Wall
      </Link>
      <div></div>
      <Link className="text-5xl font-serif" href={"/vacation-countdown"}>
        Vacation Countdown
      </Link>
      <div></div>
      <Link className="text-5xl font-serif" href={"/jelly-button-title-bar"}>
        Jelly Button Title Bar
      </Link>
    </center>
  );
}
