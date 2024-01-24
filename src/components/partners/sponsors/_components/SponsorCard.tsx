
import Image from "next/image"

export function SponsorCard() {
    return (
        <div className="shadow rounded-lg bg-white p-4 grid grid-cols-2 items-center gap-x-4">
            <Image
            src="/images/paystack.png"
            alt="sponsor-logo"
            width={300}
            height={100}
            className="w-32 h-fit"
            />
            <div className="w-full items-start justify-start fkle">

            </div>

        </div>
    )
}