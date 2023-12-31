import React from "react";

export default function page() {
  return (
    <div className="flex flex-col h-96 w-full items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={65}
        height={64}
        viewBox="0 0 65 64"
        fill="none"
      >
        <g
          style={{ mixBlendMode: "luminosity" }}
          clipPath="url(#clip0_12419_23718)"
        >
          <path
            d="M63.4013 25.9734L60.8627 6.95474C60.7527 6.11346 60.3678 5.33209 59.7679 4.73216C59.168 4.13222 58.3866 3.74735 57.5453 3.6374L38.5267 1.09873C37.9381 1.01971 37.3392 1.07775 36.7767 1.26833C36.2142 1.4589 35.7034 1.77686 35.284 2.1974L2.548 34.9227C1.91773 35.5582 1.56408 36.417 1.56408 37.3121C1.56408 38.2071 1.91773 39.0659 2.548 39.7014L24.7987 61.9521C25.4342 62.5823 26.293 62.936 27.188 62.936C28.083 62.936 28.9418 62.5823 29.5773 61.9521L62.3027 29.2161C62.7232 28.7967 63.0412 28.2859 63.2317 27.7234C63.4223 27.1609 63.4804 26.562 63.4013 25.9734ZM54.996 14.2721C54.5245 14.7437 53.9237 15.0648 53.2696 15.195C52.6156 15.3251 51.9376 15.2584 51.3215 15.0032C50.7053 14.748 50.1787 14.3158 49.8082 13.7614C49.4377 13.2069 49.2399 12.555 49.2399 11.8881C49.2399 11.2212 49.4377 10.5693 49.8082 10.0148C50.1787 9.46029 50.7053 9.02813 51.3215 8.77295C51.9376 8.51776 52.6156 8.45102 53.2696 8.58116C53.9237 8.7113 54.5245 9.03247 54.996 9.50407C55.6261 10.1375 55.9799 10.9946 55.9799 11.8881C55.9799 12.7815 55.6261 13.6387 54.996 14.2721Z"
            fill="#F74850"
          />
          <path
            d="M64.468 4.27734C64.3865 4.85459 64.1715 5.40488 63.84 5.88447C63.5086 6.36405 63.0698 6.75972 62.5587 7.04001L60.9907 7.90401L60.8627 6.95467C60.81 6.53068 60.6837 6.11915 60.4893 5.73867L61.524 5.16267C61.7469 5.04581 61.9387 4.8774 62.0834 4.67146C62.2281 4.46553 62.3216 4.22801 62.356 3.97867C62.3886 3.7303 62.3631 3.47777 62.2817 3.24088C62.2003 3.00399 62.0651 2.7892 61.8867 2.61334C61.7104 2.43488 61.495 2.29996 61.2575 2.21929C61.0201 2.13861 60.767 2.11439 60.5186 2.14855C60.2701 2.18272 60.033 2.27433 59.8261 2.41611C59.6192 2.55789 59.4482 2.74594 59.3267 2.96534L54.7613 11.1893C54.6687 11.3541 54.534 11.4913 54.3709 11.5869C54.2079 11.6825 54.0223 11.733 53.8333 11.7333C53.6499 11.7341 53.4696 11.6863 53.3107 11.5947C53.0649 11.4557 52.8842 11.225 52.8082 10.9531C52.7322 10.6812 52.7671 10.3902 52.9053 10.144L57.46 1.94134C57.7846 1.35403 58.2604 0.864285 58.8381 0.522917C59.4158 0.181549 60.0743 0.000999537 60.7453 4.90581e-06C61.237 -0.000793602 61.7239 0.0958941 62.178 0.284476C62.6321 0.473058 63.0442 0.749791 63.3907 1.09867C63.8052 1.50813 64.1184 2.00869 64.3055 2.56052C64.4925 3.11235 64.5482 3.70022 64.468 4.27734Z"
            fill="#243756"
          />
        </g>
        <defs>
          <clipPath id="clip0_12419_23718">
            <rect
              width={64}
              height={64}
              fill="white"
              transform="translate(0.5)"
            />
          </clipPath>
        </defs>
      </svg>

      <p className="text-sm px-2 font-medium text-gray-700 text-center w-1/2">
        This page is empty. All attendees with tags assign to them will appear
        here.
      </p>
    </div>
  );
}
