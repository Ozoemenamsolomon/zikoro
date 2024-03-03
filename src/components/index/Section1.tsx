import Image from "next/image"

export default function Home() {
  return (
    <div className=" mt-16">
        <div className="max-w-5xl mx-auto">
            <p className="text-5xl font-montserrat font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center">All-in-one event management platform for all kinds of events</p>
            <p className="max-w-full lg:max-w-3xl mx-auto text-center  font-montserrat text-2xl font-normal mt-10">Effortlessly sell multi-tier event tickets, engage your attendees, impress and deliver data-driven results to your event sponsors and exhibitors. It's easy to get started. And it's free. </p>   
            
            <div className="mt-10 flex items-center justify-center mx-auto">
                <button className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end px-4 py-2 rounded-md">Get Started For Free!</button>
            </div>

            <p className="text-sm font-sans font-extralight mt-2 text-center">Free 14-days trial. No credit card required.</p>

        </div>
       
       

        <div className="flex items-center justify-center mt-8">
             <Image src="/section1.png" alt="" width={1240}  height={454}/>
        </div>
    </div>
  )
}
