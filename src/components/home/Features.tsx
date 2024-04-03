"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { F1, F2, F3, F4 } from "@/constants/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Features() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="mt-12 lg:mt-24">
      <p className="text-center text-2xl lg:text-4xl font-montserrat font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">
        Features
      </p>
      <p className="max-w-xs mx-auto lg:max-w-full text-center text-base lg:text-2xl font-medium mt-6">
        See what you get from the most practical event{" "}
        <span className=" hidden lg:block">management platform</span>
      </p>

      <Tabs
        defaultValue="ticketing"
        className=" px-5 lg:px-0 max-w-full lg:max-w-6xl mx-auto mt-12 "
      >
        <TabsList className="bg-white overflow overflow-x-auto lg:overflow-y-none lg:overflow-x-none w-[300px] lg:w-full">
          <TabsTrigger value="ticketing" className="text-sm lg:text-lg">
            Ticketing & Registration
          </TabsTrigger>
          <TabsTrigger value="digital" className="text-sm lg:text-lg">
            Digital Credential
          </TabsTrigger>
          <TabsTrigger value="event" className="text-sm lg:text-lg">
            Event Management
          </TabsTrigger>
          <TabsTrigger value="attendee" className="text-sm lg:text-lg">
            Attendee Management
          </TabsTrigger>
          <TabsTrigger value="gamification" className="text-sm lg:text-lg">
            Gamification
          </TabsTrigger>
          <TabsTrigger value="exhibitor" className="text-sm lg:text-lg">
            Exhibitor's Hub
          </TabsTrigger>
        </TabsList>
        {/* tab1 */}
        <TabsContent value="ticketing" className="mt-12 ">
          <Carousel
            responsive={responsive}
            swipeable={false}
            draggable={false}
            showDots={false}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2500}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet"]}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-10-px"
            partialVisbile={false}
            className="px-0 lg:px-36 "
          >
            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pt-12 px-5 pb-16 h-[440px]  lg:h-[480px] rounded-md w-[280px] lg:w-[366px] border-[1px] border-indigo-800  ">
              <div className="pt-12 ">
                <F1 />
              </div>
              <p className="text-lg lg:text-2xl pt-6 font-normal">
                Event landing page
              </p>
              <p className="text-base lg:text-lg pt-6 font-normal">
                Streamline your event experience,providing a centralized and
                user-friendly space for all your event-related needs. Attendees
                can directly register and buy tickets from your dedicated
                landing page.
              </p>
            </div>

            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pt-12 px-5 pb-16 h-[440px]  lg:h-[480px] rounded-md w-[280px] lg:w-[366px] border-[1px] border-indigo-800 ">
              <div className="pt-12 ">
                <F2 />
              </div>
              <p className="text-lg lg:text-2xl pt-6 font-normal">
                Multi-tier ticketing
              </p>
              <p className="text-base lg:text-lg pt-6 font-normal">
                Effortlessly offer a range of ticket options with limited
                validity, offering attendees diverse access and benefits. Our
                platform gives you complete control over the success of your
                event..
              </p>
            </div>

            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pt-12 px-5 pb-16 h-[440px]  lg:h-[480px] rounded-md w-[280px] lg:w-[366px] border-[1px] border-indigo-800">
              <div className="pt-12 ">
                <F3 />
              </div>
              <p className="text-lg lg:text-2xl pt-6 font-normal">
                Payment reminders
              </p>
              <p className="text-base lg:text-lg pt-6 font-normal">
                We make event organization easier with personalized payment
                reminders. Choose your frequency and timing preferences, and
                leave the rest to Zikoro!.
              </p>
            </div>

            <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pt-12 px-5 pb-16 h-[440px]  lg:h-[480px] rounded-md w-[280px] lg:w-[366px] border-[1px] border-indigo-800">
              <div className="pt-12 ">
                <F4 />
              </div>
              <p className="text-lg lg:text-2xl pt-6 font-normal">
                Payment processing
              </p>
              <p className="text-base lg:text-lg pt-6 font-normal">
                Build trust with your customers and enhance their overall
                satisfaction. We offer a payment experience that is not only
                secure but also versatile.
              </p>
            </div>
          </Carousel>
        </TabsContent>
        <TabsContent value="digital"></TabsContent>
        <TabsContent value="event"></TabsContent>
        <TabsContent value="attendee"></TabsContent>
        <TabsContent value="gamification"></TabsContent>
        <TabsContent value="exhibitor"></TabsContent>
      </Tabs>
    </div>
  );
}
