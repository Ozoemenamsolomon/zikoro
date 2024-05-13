"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Facebook, X, Linkedin, Instagram } from "@/constants/icons";
import PostArticle from "@/components/blog/PostArticle";
import { useFetchBlogPost } from "@/hooks/services/post";
import {
  shareOnFacebook,
  shareOnInstagram,
  shareOnLinkedin,
  shareOnTwitter,
} from "@/utils/shareOnSocial";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DBSimilarPost = {
  id: number;
  title: string;
  created_at: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: JSON;
  views: number;
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};

type DBBlogPost = {
  id: number;
  title: string;
  created_at: string;
  category: string;
  status: string;
  statusDetails: JSON;
  readingDuration: number;
  content: string;
  views: number;
  shares: JSON;
  tags: [];
  headerImageUrl: string;
};

export default function FullPost({ postId }: { postId: string }): JSX.Element {
  const {
    data,
    refetch,
  }: {
    data: DBBlogPost | null;
    loading: boolean;
    refetch: () => Promise<null | undefined>;
  } = useFetchBlogPost(postId);

  const [similarPosts, setSimilarPosts] = useState<DBSimilarPost[]>([]);
  const [postTag, setPostTag] = useState<any>([]);

  //for side bar links
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: any): any {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        // throw new Error("Invalid date");
      }
      const formattedDate: string = formatDate(date);
      return formattedDate;
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  //formatDate
  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
    const day: number = date.getDate();

    const monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
    return formattedDate;
  }

  //share functionality
  const [articleUrl] = useState<string>(
    `https://www.zikoro.com/live-events/${postId}`
  );
  const handleShareOnFacebook = () => {
    shareOnFacebook(articleUrl);
  };

  const handleShareOnTwitter = () => {
    shareOnTwitter(articleUrl, postId);
  };

  const handleShareOnInstagram = () => {
    shareOnInstagram();
  };

  const handleShareOnLinkedin = () => {
    shareOnLinkedin(articleUrl, postId);
  };
  //share
  //ID and

  //useEffect
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      e.preventDefault();
      const targetId = (e.target as HTMLAnchorElement).getAttribute("href");
      if (targetId) {
        const targetElement = document.getElementById(targetId.slice(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          // router.push(`#${targetId.slice(1)}`, undefined, { shallow: true });
          router.push(`#${targetId.slice(1)}`, { shallow: true });
        }
      }
    };

    const contentDiv = contentRef.current;
    if (contentDiv) {
      contentDiv.addEventListener("click", handleAnchorClick);
      return () => {
        contentDiv.removeEventListener("click", handleAnchorClick);
      };
    }

    async function fetchSimilarPost() {
      try {
        const response = await fetch("/api/blog/published", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();

        console.log(data);
        data.data.map((tag: any) => setPostTag(tag.tags));
        if (data && postTag) {
          // Convert tags array into a string
          const tagString = postTag.join(",");

          // Filter similar posts based on matching tag strings
          const similarPostsFiltered = data.data.filter((post: any) => {
            const postTagString = post.tags.join(",");
            return postTagString.includes(tagString);
          });

          console.log("Similar posts:", similarPostsFiltered);
          setSimilarPosts(similarPostsFiltered);
        }
      } catch (error) {
        console.error("Error fetching similar posts:", error);
      }
    }

    fetchSimilarPost();
  }, [router]);

  const headings = data?.content.match(/<h[3](.*?)>(.*?)<\/h[3]>/g) || [];

  return (
    <>
      {data && (
        <div className="mt-[120px] lg:mt-[200px] px-3 lg:px-0 ">
          {/* header section */}
          <div className="max-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
            <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-2 text-center ">
              <p className="text-indigo-600 text-[12px] lg:text-[15px] font-medium uppercase">
                {data?.category}
              </p>
              <p className="capitalize text-2xl font-semibold lg:text-4xl ">
                {data?.title}
              </p>
              <p className="uppercase text-gray-400">
                {extractAndFormatDate(data?.created_at)} -{" "}
                <span>{data?.readingDuration} mins read </span>
              </p>
            </div>
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={982}
              height={450}
              className="w-[982px] h-[450px] object-cover hidden lg:block"
            />
            <Image
              src={
                data?.headerImageUrl ? data?.headerImageUrl : "/postImage2.png"
              }
              alt=""
              width={335}
              height={160}
              className="w-full h-[160px] object-cover block lg:hidden"
            />
          </div>

          {/* body section */}
          <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-28 lg:mb-20 ">
            {/* Left */}
            <div className="hidden lg:inline h-full pb-12 w-full flex-col  lg:w-3/12">
              {/* section links */}
              <div className="flex-col">
                {/* Top */}
                <p className="text-xl font-semibold">On This Page</p>
                {/* Links */}

                {headings.map((heading, index) => {
                  const id = `section-${index}`;
                  return (
                    <div key={id} id={id}>
                      <Link href={`#${id}`}>
                        <div className="text-base font-semibold mt-8">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: heading ?? "",
                            }}
                          />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Share Buttons */}
              <div className="mt-8">
                <p className="text-xl font-medium">Share This Article</p>
                <div className="flex gap-x-[14px] mt-4">
                  <div
                    className="cursor-pointer"
                    onClick={handleShareOnTwitter}
                  >
                    <X />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={handleShareOnFacebook}
                  >
                    <Facebook />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={handleShareOnInstagram}
                  >
                    <Instagram />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={handleShareOnLinkedin}
                  >
                    <Linkedin />
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={contentRef}
              className=" h-fit lg:h-[505px] overflow-y-hidden lg:overflow-y-auto  w-full lg:w-9/12  flex-col  pb-0 lg:pb-[50px]"
            >
              <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-t-0 lg:border-t-[1px] border-gray-300 mb-12 lg:mb-24 mt-44">
            <p className="text-center text-xl lg:text-3xl font-semibold mt-14">
              Read More Articles
            </p>
            <div className="flex flex-col lg:flex-row  px-0 lg:px-[146px] gap-x-0 lg:gap-x-[100px] gap-y-7 lg:gap-y-0 py-7 lg:py-16">
              {similarPosts.length > 0 ? (
                <div className="flex flex-col lg:flex-row  px-0 lg:px-[146px] gap-x-0 lg:gap-x-[100px] gap-y-7 lg:gap-y-0 py-7 lg:py-16">
                  {similarPosts.slice(0,2).map((post) => (
                    <PostArticle
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      createdAt={post.created_at}
                      category={post.category}
                      status={post.status}
                      statusDetails={post.statusDetails}
                      readingDuration={post.readingDuration}
                      content={post.content}
                      views={post.views}
                      shares={post.shares}
                      tags={post.tags}
                      headerImageUrl={post.headerImageUrl}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-xl lg:text-3xl font-semibold mt-8">
                  No related posts found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
