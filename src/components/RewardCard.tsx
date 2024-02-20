interface RewardCardProps {
  imgSrc: string;
  text: string;
  points: Number;
}

import Image from "next/image";

const RewardCard: React.FC<RewardCardProps> = ({ text, imgSrc, points }) => {
  return (
    <section className="rounded-md flex flex-col gap-4 p-1.5 bg-[#FAFAFA] justify-center items-center">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
        >
          <g clip-path="url(#clip0_11614_9246)">
            <path
              d="M3.97046 6.14893L1.34985 11.0862L3.72959 10.8664L4.88138 12.9606L7.50199 8.0233L3.97046 6.14893Z"
              fill="#E95454"
            />
            <path
              d="M4.27043 11.5227C4.34397 11.3648 4.26706 11.1761 4.11324 11.0943L3.96241 11.014C3.81159 10.9281 3.75419 10.7371 3.83636 10.5826C3.91964 10.4254 4.11549 10.3653 4.27269 10.4486L4.69888 10.6749C4.83057 10.7446 4.99565 10.694 5.06356 10.5615L5.07406 10.5413C5.1521 10.4164 5.10595 10.2513 4.97614 10.1826L3.70129 9.50618C3.54597 9.42364 3.46981 9.23568 3.54222 9.07735C3.62213 8.9089 3.82397 8.84249 3.98643 8.92878L5.16898 9.55645C5.30067 9.62624 5.46574 9.57559 5.53553 9.4439L5.54228 9.42664L5.54416 9.42289C5.61957 9.28483 5.56667 9.11149 5.42748 9.03759L4.76417 8.68567C4.60884 8.60313 4.53268 8.41517 4.60622 8.25497C4.68538 8.08839 4.88797 8.02011 5.05042 8.1064L5.78314 8.49546C5.92008 8.56824 6.08366 8.50746 6.15457 8.3694C6.15569 8.36752 6.15569 8.36752 6.15644 8.36564C6.15757 8.36377 6.15757 8.36377 6.15832 8.36189C6.23298 8.2257 6.19171 8.05612 6.0544 7.98372L5.2639 7.56427C5.11045 7.48286 5.03429 7.29489 5.1067 7.13657C5.18661 6.96812 5.38846 6.90171 5.55091 6.988L7.50107 8.02311L4.88047 12.9604L4.15826 11.6477C4.20478 11.6162 4.2453 11.5772 4.27043 11.5227Z"
              fill="#ED6362"
            />
            <path
              d="M8.87235 6.14893L11.493 11.0862L9.11321 10.8664L7.96142 12.9606L5.34082 8.0233L8.87235 6.14893Z"
              fill="#ED6362"
            />
            <path
              d="M8.57232 11.5229C8.49879 11.3649 8.5757 11.1762 8.72952 11.0944L8.88034 11.0141C9.03116 10.9282 9.08857 10.7372 9.0064 10.5827C8.92311 10.4255 8.72727 10.3654 8.57007 10.4487L8.14387 10.675C8.01219 10.7447 7.84711 10.6941 7.7792 10.5617L7.7687 10.5414C7.69066 10.4165 7.73681 10.2514 7.86662 10.1827L9.14184 9.50592C9.29716 9.42338 9.37332 9.23542 9.30091 9.07709C9.221 8.90864 9.01916 8.84223 8.85671 8.92852L7.67415 9.55619C7.54247 9.62597 7.37739 9.57533 7.30761 9.44364L7.30085 9.42638L7.29898 9.42263C7.22357 9.28456 7.27647 9.11123 7.41566 9.03732L8.07897 8.68541C8.23429 8.60287 8.31045 8.41491 8.23692 8.25471C8.15775 8.08813 7.95516 8.01985 7.79271 8.10614L7.05924 8.49594C6.9223 8.56873 6.75872 8.50795 6.68781 8.36988C6.68669 8.36801 6.68669 8.36801 6.68594 8.36613C6.68481 8.36426 6.68481 8.36426 6.68406 8.36238C6.6094 8.22619 6.65067 8.05661 6.78799 7.9842L7.57848 7.56476C7.73193 7.48334 7.80809 7.29538 7.73568 7.13706C7.65577 6.9686 7.45392 6.9022 7.29147 6.98849L5.34131 8.0236L7.96191 12.9609L8.68413 11.6482C8.63798 11.6163 8.59746 11.5773 8.57232 11.5229Z"
              fill="#E95454"
            />
            <path
              d="M6.4214 9.71829C8.83968 9.71829 10.8001 7.75789 10.8001 5.33961C10.8001 2.92134 8.83968 0.960938 6.4214 0.960938C4.00313 0.960938 2.04272 2.92134 2.04272 5.33961C2.04272 7.75789 4.00313 9.71829 6.4214 9.71829Z"
              fill="#FFCC5B"
            />
            <path
              d="M7.01524 4.83721H4.24044C4.02472 4.83721 3.84763 4.66013 3.84763 4.4444L3.85064 4.41739V4.41139C3.84763 4.18366 4.03335 3.99757 4.26145 3.99757H6.18461C6.43935 3.99757 6.66446 3.80886 6.67946 3.55374C6.69147 3.28699 6.47874 3.06188 6.21162 3.06188H4.17441C3.94968 3.06188 3.7816 2.87317 3.78461 2.64806C3.78461 2.64506 3.78461 2.64506 3.78461 2.64206C3.78461 2.63906 3.78461 2.63906 3.78461 2.63606C3.7816 2.41133 3.94931 2.22224 4.17441 2.22224H6.30616C6.55791 2.22224 6.78301 2.03352 6.79802 1.78141C6.81002 1.51165 6.5973 1.28955 6.33017 1.28955H4.76907C3.1772 1.94573 2.05542 3.51097 2.05542 5.33957C2.05542 7.16818 3.1772 8.73304 4.76944 9.38847H6.7515C7.00324 9.38847 7.22834 9.19976 7.24335 8.94764C7.25536 8.67789 7.04263 8.45616 6.77551 8.45616L4.5207 8.45578C4.2547 8.45578 4.04048 8.23331 4.05473 7.96393C4.06786 7.71181 4.29447 7.52235 4.54696 7.52235H5.42112C5.67249 7.51522 5.87546 7.30925 5.87546 7.056C5.87546 6.79826 5.66574 6.58816 5.40762 6.58816H4.08249C3.86677 6.58816 3.68969 6.41145 3.69269 6.19535V6.16233C3.67768 5.94961 3.84876 5.76953 4.06149 5.76953H6.98823C7.24298 5.76953 7.46808 5.58081 7.48309 5.32869C7.49509 5.05932 7.28199 4.83721 7.01524 4.83721Z"
              fill="#FDBC4B"
            />
            <path
              d="M6.42149 8.46467C4.69793 8.46467 3.2959 7.06226 3.2959 5.33908C3.2959 3.6159 4.69793 2.21387 6.42149 2.21387C8.14505 2.21387 9.54708 3.61627 9.54708 5.33946C9.54708 7.06264 8.14505 8.46467 6.42149 8.46467Z"
              fill="#FFDB70"
            />
            <path
              opacity="0.2"
              d="M9.54699 5.33973C9.54699 3.67695 8.24063 2.31694 6.60073 2.22314H6.3096C6.11751 2.22314 5.94605 2.36721 5.93442 2.5593C5.92542 2.7649 6.08749 2.93448 6.29121 2.93448L8.01102 2.93485C8.21399 2.93485 8.37719 3.10443 8.36631 3.31003C8.35618 3.50249 8.1836 3.64694 7.99076 3.64694H7.32407C7.13236 3.65256 6.97741 3.80939 6.97741 4.0026C6.97741 4.1992 7.13761 4.3594 7.3342 4.3594H8.34492C8.50963 4.3594 8.64432 4.49446 8.64206 4.65879V4.68355C8.65332 4.846 8.52313 4.98294 8.36068 4.98294H6.12876C5.93442 4.98294 5.76296 5.12701 5.75133 5.3191C5.74233 5.52469 5.90441 5.69427 6.10813 5.69427H8.22412C8.38882 5.69427 8.52351 5.82933 8.52351 5.99366L8.52126 6.0143V6.0188C8.52351 6.19251 8.38169 6.33432 8.20799 6.33432H6.74105C6.54671 6.33432 6.37525 6.47839 6.36362 6.67273C6.35462 6.87608 6.51669 7.04791 6.72041 7.04791H8.27402C8.44547 7.04791 8.57341 7.19197 8.57116 7.36343C8.57116 7.36568 8.57116 7.36568 8.57116 7.36793C8.57116 7.37018 8.57116 7.37018 8.57116 7.37243C8.57341 7.54389 8.44547 7.68796 8.27402 7.68796H6.64838C6.45629 7.68796 6.28483 7.83202 6.2732 8.02411C6.2642 8.23009 6.42628 8.39929 6.63 8.39929H7.05882C8.47811 8.10365 9.54699 6.84419 9.54699 5.33973Z"
              fill="white"
            />
            <path
              d="M8.60337 4.64722H7.08316L6.61306 3.2013C6.55266 3.01558 6.28966 3.01558 6.22926 3.2013L5.75954 4.64722H4.23932C4.04386 4.64722 3.96244 4.89747 4.12077 5.01227L5.3506 5.90594L4.88088 7.35187C4.82047 7.53758 5.0332 7.69215 5.19152 7.57735L6.42135 6.68368L7.65117 7.57735C7.8095 7.69215 8.02222 7.53758 7.96182 7.35187L7.4921 5.90594L8.72193 5.01227C8.87987 4.89747 8.79884 4.64722 8.60337 4.64722Z"
              fill="#EC9922"
            />
          </g>
          <defs>
            <clipPath id="clip0_11614_9246">
              <rect
                width="12"
                height="12"
                fill="white"
                transform="translate(0.421387 0.960938)"
              />
            </clipPath>
          </defs>
        </svg>
        <span className=" text-[7px] font-medium text-[#3F845F]">{`${points} pts`}</span>
      </div>
      <Image src={imgSrc} width={32} height={32} alt="Reward point picture" />
      <span className=" text-greyBlack text-[8px] font-medium text-center">{text}</span>
    </section>
  );
};

export default RewardCard;