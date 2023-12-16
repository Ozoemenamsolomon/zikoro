import Image from 'next/image';

const PointsCard=({imgSrc,heading,text})=>{
    return (
        <section className=" py-[22px] bg-white rounded-lg px-[18px] flex items-center gap-2">
            <Image src={imgSrc} width={32} height={32} alt="" />
            <div className="">
                <h4 className=" text-sm text-greyBlack font-medium">{heading}</h4>
                <p className=" text-small font-normal text-[#717171]">{text}</p>
            </div>
        </section>
    )
}

export default PointsCard;