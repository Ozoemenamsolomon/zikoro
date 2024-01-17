import Image from "next/image";
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t mt-10 flex items-center justify-between p-4 ">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={300}
        height={300}
        className="w-[64px] h-[64px]"
      />

      <p>Powered by Zikoro | <Link href="https://www.zikoro.com">www.zikoro.com</Link></p>

      <div className="flex items-start flex-col justify-start gap-y-2">
        <p>Privacy policy</p>
        <p>Terms & Conditions</p>
      </div>
    </footer>
  );
}
