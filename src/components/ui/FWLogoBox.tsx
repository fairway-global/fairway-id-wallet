import Image from "next/image";

export default function FWLogoBox() {
    return(
        <div className="rounded-r-lg -ml-2 bg-fwNewGreen px-2 py-0.5 w-max">
            <Image
                src="/fw-logo-h.png"
                alt="Fairway logo"
                width={180}
                height={30}
                priority
            />
        </div>
    )
} 