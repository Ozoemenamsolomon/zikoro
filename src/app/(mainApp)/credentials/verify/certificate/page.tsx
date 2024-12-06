"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAttendeeCertificate } from "@/hooks/services/certificate";
import { useRouter } from "next/navigation";

const Page = () => {
  const [certificateId, setCertificateId] = useState<string>("");
  const router = useRouter();

  const { getAttendeeCertificate, isLoading, error } =
    useGetAttendeeCertificate();

  const onSubmit = async () => {
    const certificate = await getAttendeeCertificate({ certificateId });

    if (!!certificate) router.push(`/verify/cerificate/${certificateId}`);
  };

  return (
    <section className="h-fit md:h-screen w-screen flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
      <div className="flex-1 flex justify-center">
        <svg
          className="w-[150px] h-[300px] lg:w-[350px] lg:h-[500px]"
          viewBox="0 0 444 598"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_472_601)">
            <g filter="url(#filter0_d_472_601)">
              <path
                d="M80.8982 -2.09499e-05L74.7664 474.746L437.643 479.433L443.775 4.68695L80.8982 -2.09499e-05Z"
                fill="#EFEFEF"
              />
              <path
                opacity="0.09"
                d="M407.495 70.1625L293.025 92.1815C274.497 95.7488 255.437 95.501 237.008 91.4533L123.198 66.4697C100.599 62.3411 84.2055 41.6352 84.5381 17.5921L84.7216 3.11914L443.557 4.72469L443.844 23.0739C443.529 47.1343 430.185 66.6245 407.495 70.1625Z"
                fill="#272525"
              />
              <path
                d="M403.453 67.0548L289.011 89.0738C270.484 92.6411 251.423 92.3933 232.995 88.3456L119.149 63.3678C96.5569 59.2335 80.1573 38.5276 80.4899 14.4844L80.6791 0L443.557 4.71345L443.368 19.1749C443.053 43.2582 426.143 63.5169 403.453 67.0548Z"
                fill="#EFEFEF"
              />
              <path
                d="M262.175 175.43C254.572 175.324 247.321 172.206 242.013 166.76C236.706 161.314 233.776 153.984 233.866 146.381L234.761 77.6629C234.859 70.0589 237.975 62.8057 243.422 57.4988C248.868 52.192 256.2 49.2661 263.804 49.365C271.408 49.4638 278.661 52.5793 283.968 58.026C289.275 63.4726 292.201 70.8044 292.102 78.4083L291.207 147.132C291.099 154.73 287.981 161.976 282.539 167.281C277.097 172.585 269.774 175.515 262.175 175.43ZM263.781 51.8593C256.844 51.775 250.156 54.4432 245.182 59.2795C240.208 64.1158 237.354 70.7262 237.243 77.6629L236.355 146.415C236.31 149.855 236.944 153.27 238.219 156.465C239.494 159.659 241.386 162.572 243.787 165.036C246.188 167.499 249.051 169.466 252.212 170.823C255.373 172.181 258.77 172.902 262.21 172.947C265.65 172.991 269.064 172.358 272.259 171.082C275.454 169.807 278.367 167.915 280.831 165.514C283.294 163.113 285.261 160.251 286.618 157.09C287.976 153.929 288.697 150.531 288.742 147.092L289.636 78.3682C289.713 71.4272 287.034 64.7391 282.187 59.77C277.341 54.8008 270.722 51.956 263.781 51.8593Z"
                fill="url(#paint0_linear_472_601)"
              />
              <path
                d="M290.403 74.1501C293.585 59.3344 284.154 44.7447 269.338 41.5631C254.522 38.3815 239.933 47.8127 236.751 62.6284C233.57 77.4441 243.001 92.0338 257.816 95.2154C272.632 98.397 287.222 88.9658 290.403 74.1501Z"
                fill="#001FCC"
              />
              <path
                d="M277.457 70.6299C278.693 62.9638 273.48 55.747 265.814 54.5109C258.148 53.2747 250.931 58.4873 249.695 66.1534C248.459 73.8195 253.671 81.0363 261.337 82.2724C269.004 83.5086 276.22 78.296 277.457 70.6299Z"
                fill="#BDB39B"
              />
              <path
                d="M270.089 68.4881C270.071 69.7819 269.671 71.0417 268.938 72.108C268.205 73.1743 267.172 73.9992 265.97 74.4786C264.768 74.958 263.451 75.0702 262.186 74.8011C260.92 74.5319 259.763 73.8936 258.86 72.9666C257.957 72.0397 257.349 70.8659 257.113 69.5936C256.878 68.3213 257.024 67.0077 257.535 65.8188C258.046 64.6299 258.898 63.6192 259.983 62.9144C261.068 62.2097 262.338 61.8425 263.632 61.8594C264.491 61.8699 265.34 62.0498 266.13 62.3887C266.92 62.7277 267.635 63.219 268.235 63.8347C268.835 64.4504 269.307 65.1783 269.625 65.9768C269.943 66.7753 270.101 67.6287 270.089 68.4881Z"
                fill="#434244"
              />
              <path
                d="M289.38 160.1C292.222 145.215 282.46 130.845 267.575 128.003C252.69 125.161 238.32 134.923 235.478 149.808C232.636 164.692 242.398 179.063 257.283 181.905C272.167 184.747 286.538 174.984 289.38 160.1Z"
                fill="#001FCC"
              />
              <path
                d="M273.911 163.079C278.397 156.741 276.896 147.966 270.557 143.48C264.219 138.994 255.444 140.495 250.958 146.833C246.472 153.172 247.974 161.946 254.312 166.433C260.65 170.919 269.425 169.417 273.911 163.079Z"
                fill="#BDB39B"
              />
              <path
                d="M268.982 155.039C268.965 156.333 268.564 157.592 267.831 158.659C267.098 159.725 266.066 160.55 264.864 161.029C263.662 161.509 262.345 161.621 261.079 161.352C259.813 161.083 258.656 160.444 257.753 159.517C256.85 158.591 256.242 157.417 256.007 156.144C255.771 154.872 255.918 153.558 256.429 152.37C256.939 151.181 257.791 150.17 258.876 149.465C259.962 148.76 261.231 148.393 262.525 148.41C263.385 148.421 264.234 148.601 265.023 148.939C265.813 149.278 266.529 149.77 267.128 150.386C267.728 151.001 268.2 151.729 268.518 152.528C268.837 153.326 268.994 154.179 268.982 155.039Z"
                fill="#434244"
              />
            </g>
            <g filter="url(#filter1_d_472_601)">
              <g filter="url(#filter2_d_472_601)">
                <path
                  d="M333.674 137.762H0V598H333.674V137.762Z"
                  fill="#FFFFF5"
                />
              </g>
              <path
                d="M97.8471 204.909H284.946C290.032 204.909 290.032 197.019 284.946 197.019H97.8471C92.7609 197.019 92.7609 204.909 97.8471 204.909Z"
                fill="#BBBCBF"
              />
              <path
                d="M38.7225 251.653H284.946C290.032 251.653 290.032 243.763 284.946 243.763H38.7225C33.6364 243.763 33.6364 251.653 38.7225 251.653Z"
                fill="#BBBCBF"
              />
              <path
                d="M38.7225 298.427H284.946C290.032 298.427 290.032 290.536 284.946 290.536H38.7225C33.6364 290.536 33.6364 298.427 38.7225 298.427Z"
                fill="#BBBCBF"
              />
              <path
                d="M38.7225 345.143H284.946C290.032 345.143 290.032 337.252 284.946 337.252H38.7225C33.6364 337.252 33.6364 345.143 38.7225 345.143Z"
                fill="#BBBCBF"
              />
              <path
                d="M38.7225 391.893H284.946C290.032 391.893 290.032 384.002 284.946 384.002H38.7225C33.6364 384.002 33.6364 391.893 38.7225 391.893Z"
                fill="#BBBCBF"
              />
              <path
                d="M236.882 500.422L219.559 557.041L232.845 545.04L238.774 562.15L253.523 494.425L241.561 484.006L236.882 500.422Z"
                fill="#001FCC"
              />
              <path
                d="M253.54 505.732L270.96 562.316L275.226 544.936L289.734 555.774L263.947 491.431L248.201 489.516L253.54 505.732Z"
                fill="#001FCC"
              />
              <path
                d="M256.275 445.478L257.995 451.86C258.196 452.596 258.581 453.267 259.115 453.812C259.649 454.356 260.313 454.754 261.044 454.969C261.776 455.183 262.55 455.207 263.293 455.037C264.036 454.867 264.723 454.51 265.289 453.999L270.192 449.566C270.919 448.912 271.841 448.514 272.816 448.435C273.791 448.355 274.765 448.599 275.588 449.127C276.411 449.656 277.038 450.44 277.371 451.36C277.705 452.28 277.727 453.283 277.434 454.217L275.438 460.524C275.21 461.251 275.171 462.024 275.326 462.769C275.481 463.515 275.824 464.208 276.323 464.783C276.823 465.359 277.461 465.796 278.177 466.054C278.894 466.313 279.664 466.383 280.416 466.259L286.935 465.18C287.902 465.018 288.896 465.179 289.762 465.638C290.628 466.098 291.318 466.83 291.726 467.722C292.134 468.614 292.236 469.615 292.017 470.57C291.797 471.526 291.269 472.383 290.513 473.008L285.422 477.234C284.829 477.721 284.372 478.352 284.095 479.068C283.818 479.783 283.73 480.557 283.84 481.316C283.949 482.075 284.253 482.793 284.72 483.401C285.188 484.009 285.805 484.486 286.511 484.785L292.583 487.406C293.483 487.793 294.23 488.466 294.708 489.321C295.187 490.176 295.371 491.164 295.231 492.133C295.091 493.103 294.636 493.999 293.936 494.684C293.235 495.369 292.329 495.803 291.356 495.921L284.797 496.724C284.04 496.817 283.319 497.102 282.704 497.553C282.089 498.003 281.6 498.604 281.283 499.298C280.966 499.991 280.832 500.755 280.894 501.515C280.956 502.275 281.212 503.006 281.637 503.639L285.33 509.127C285.879 509.939 286.144 510.91 286.085 511.888C286.026 512.867 285.646 513.798 285.004 514.539C284.362 515.28 283.494 515.788 282.534 515.985C281.574 516.182 280.575 516.057 279.693 515.629L273.741 512.762C273.054 512.431 272.294 512.281 271.533 512.327C270.772 512.373 270.035 512.613 269.393 513.025C268.751 513.437 268.226 514.006 267.867 514.679C267.508 515.352 267.327 516.105 267.342 516.868L267.485 523.479C267.508 524.459 267.207 525.42 266.629 526.211C266.051 527.003 265.227 527.582 264.287 527.858C263.346 528.135 262.341 528.093 261.426 527.74C260.511 527.387 259.739 526.742 259.228 525.905L255.788 520.268C255.389 519.618 254.83 519.082 254.164 518.709C253.498 518.337 252.749 518.141 251.986 518.141C251.223 518.141 250.473 518.337 249.808 518.709C249.142 519.082 248.583 519.618 248.184 520.268L244.744 525.905C244.233 526.742 243.46 527.387 242.546 527.74C241.631 528.093 240.626 528.135 239.685 527.858C238.744 527.582 237.921 527.003 237.343 526.211C236.765 525.42 236.464 524.459 236.487 523.479L236.624 516.868C236.64 516.106 236.461 515.352 236.102 514.679C235.744 514.006 235.219 513.436 234.577 513.025C233.936 512.613 233.199 512.372 232.438 512.326C231.677 512.28 230.917 512.43 230.231 512.762L224.273 515.629C223.391 516.052 222.395 516.173 221.437 515.974C220.48 515.775 219.614 515.267 218.974 514.528C218.333 513.789 217.953 512.861 217.892 511.885C217.831 510.909 218.093 509.94 218.636 509.127L222.329 503.639C222.756 503.007 223.013 502.276 223.076 501.516C223.139 500.756 223.006 499.992 222.69 499.298C222.373 498.604 221.884 498.003 221.269 497.552C220.653 497.101 219.932 496.816 219.175 496.724L212.61 495.921C211.637 495.803 210.731 495.369 210.03 494.684C209.33 493.999 208.875 493.103 208.735 492.133C208.595 491.164 208.779 490.176 209.258 489.321C209.736 488.466 210.483 487.793 211.383 487.406L217.426 484.785C218.127 484.484 218.739 484.008 219.203 483.403C219.667 482.797 219.968 482.083 220.076 481.328C220.185 480.573 220.098 479.802 219.824 479.09C219.55 478.379 219.097 477.749 218.51 477.262L213.424 473.036C212.669 472.412 212.142 471.556 211.922 470.601C211.703 469.646 211.805 468.645 212.212 467.754C212.619 466.863 213.308 466.131 214.173 465.671C215.038 465.211 216.03 465.048 216.996 465.209L223.522 466.287C224.273 466.41 225.043 466.338 225.758 466.08C226.474 465.821 227.111 465.383 227.61 464.809C228.109 464.234 228.452 463.541 228.608 462.796C228.764 462.052 228.726 461.279 228.499 460.553L226.503 454.246C226.208 453.312 226.227 452.308 226.56 451.387C226.892 450.466 227.518 449.68 228.342 449.151C229.165 448.621 230.14 448.378 231.116 448.458C232.092 448.539 233.014 448.938 233.74 449.595L238.648 454.028C239.214 454.539 239.9 454.896 240.643 455.066C241.386 455.236 242.16 455.212 242.891 454.998C243.622 454.783 244.286 454.385 244.819 453.84C245.352 453.296 245.737 452.624 245.936 451.889L247.657 445.507C247.904 444.554 248.459 443.709 249.237 443.105C250.015 442.502 250.97 442.172 251.955 442.169C252.939 442.166 253.897 442.489 254.679 443.087C255.46 443.686 256.022 444.527 256.275 445.478Z"
                fill="url(#paint1_linear_472_601)"
              />
              <path
                d="M251.969 507.148C247.607 507.148 243.343 505.855 239.716 503.432C236.09 501.008 233.263 497.564 231.594 493.534C229.925 489.505 229.488 485.07 230.339 480.793C231.19 476.515 233.29 472.585 236.375 469.501C239.459 466.417 243.388 464.316 247.666 463.465C251.944 462.614 256.378 463.051 260.408 464.72C264.438 466.389 267.882 469.216 270.305 472.843C272.729 476.469 274.022 480.733 274.022 485.095C274.016 490.942 271.691 496.548 267.556 500.682C263.422 504.817 257.816 507.142 251.969 507.148ZM251.969 463.833C247.762 463.833 243.65 465.08 240.152 467.418C236.655 469.755 233.929 473.077 232.319 476.963C230.71 480.85 230.289 485.126 231.11 489.252C231.931 493.378 233.957 497.167 236.932 500.141C239.907 503.116 243.697 505.141 247.823 505.961C251.949 506.781 256.225 506.359 260.112 504.748C263.998 503.137 267.319 500.411 269.655 496.912C271.991 493.414 273.238 489.302 273.237 485.095C273.23 479.457 270.988 474.051 267 470.065C263.013 466.079 257.607 463.837 251.969 463.833Z"
                fill="white"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_472_601"
              x="67.7664"
              y={-3}
              width="383.078"
              height="493.433"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius={1}
                operator="erode"
                in="SourceAlpha"
                result="effect1_dropShadow_472_601"
              />
              <feOffset dy={4} />
              <feGaussianBlur stdDeviation={4} />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.262745 0 0 0 0 0.258824 0 0 0 0 0.266667 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_472_601"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_472_601"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_d_472_601"
              x={-7}
              y="134.762"
              width="347.674"
              height="474.238"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius={1}
                operator="erode"
                in="SourceAlpha"
                result="effect1_dropShadow_472_601"
              />
              <feOffset dy={4} />
              <feGaussianBlur stdDeviation={4} />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.262745 0 0 0 0 0.258824 0 0 0 0 0.266667 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_472_601"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_472_601"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d_472_601"
              x={-7}
              y="134.762"
              width="347.674"
              height="474.238"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius={1}
                operator="erode"
                in="SourceAlpha"
                result="effect1_dropShadow_472_601"
              />
              <feOffset dy={4} />
              <feGaussianBlur stdDeviation={4} />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.262745 0 0 0 0 0.258824 0 0 0 0 0.266667 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_472_601"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_472_601"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_472_601"
              x1="233.864"
              y1="112.397"
              x2="292.104"
              y2="112.397"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#001FCC" />
              <stop offset={1} stopColor="#9D00FF" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_472_601"
              x1="208.69"
              y1="485.104"
              x2="295.277"
              y2="485.104"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#001FCC" />
              <stop offset={1} stopColor="#9D00FF" />
            </linearGradient>
            <clipPath id="clip0_472_601">
              <rect width="443.838" height={598} fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex-1 flex flex-col items-center gap-4 md:gap-8 py-4 px-2 md:py-0 md:px-0">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-gray-800 font-medium md:text-xl">
            Verify certificate
          </h1>
          <span className="text-gray-700 md:w-3/4">
            To verify the authenticity of a certificate, compare its details
            with the presented copy.
          </span>
        </div>
        <div className="flex flex-col gap-2 w-full items-center">
          <span className="text-gray-800 font-medium">Certificate ID</span>
          <Input
            onInput={(e) => setCertificateId(e.currentTarget.value)}
            placeholder="Enter certificate ID"
            className="w-full md:w-3/4 rounded-none bg-gray-100 border border-gray-400"
          />
        </div>
        <Button
          className="bg-basePrimary w-full md:w-3/4 rounded-none py-4"
          disabled={certificateId.length < 8}
          onClick={onSubmit}
        >
          Verify
        </Button>
      </div>
    </section>
  );
};

export default Page;
