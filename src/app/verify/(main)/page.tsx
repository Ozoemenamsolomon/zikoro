"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAttendeeCertificate } from "@/hooks/services/certificate";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const [certificateId, setCertificateId] = useState<string>("");
  const router = useRouter();

  const { getAttendeeCertificate, isLoading, error } =
    useGetAttendeeCertificate();

  const onSubmit = async () => {
    const certificate = await getAttendeeCertificate(certificateId);

    console.log(certificate);

    if (!!certificate) router.push(`/verify/${certificateId}`);
  };

  return (
    <section className="h-screen w-screen flex items-center justify-center gap-6 pt-8">
      <div className="flex-1 flex justify-center">
        <svg
          width={354}
          height={444}
          viewBox="0 0 354 444"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M213.524 334.761L205.781 336.573C205.078 336.737 204.361 336.82 203.65 336.82C198.875 336.821 194.818 333.084 194.415 328.315L192.687 307.893C192.342 303.797 189.774 300.262 185.985 298.666L167.097 290.713C164.609 289.666 162.704 287.592 161.87 285.025C161.036 282.458 161.359 279.66 162.756 277.351L173.361 259.815C175.488 256.297 175.488 251.927 173.361 248.41L162.756 230.873C161.359 228.564 161.036 225.766 161.87 223.199C162.704 220.632 164.61 218.558 167.097 217.511L185.985 209.558C189.774 207.963 192.342 204.427 192.687 200.331L194.415 179.909C194.819 175.14 198.876 171.404 203.65 171.404C204.361 171.404 205.079 171.487 205.781 171.651L225.737 176.319C226.559 176.512 227.404 176.61 228.247 176.61C231.45 176.61 234.488 175.219 236.584 172.796L249.983 157.29C251.748 155.247 254.308 154.076 257.008 154.076C259.709 154.076 262.268 155.247 264.034 157.29L277.433 172.796C279.528 175.22 282.567 176.61 285.77 176.61C286.453 176.61 287.135 176.528 287.809 176.402V8.93377C287.809 3.99947 283.809 0 278.875 0H9.46197C4.52767 0 0.528198 3.99947 0.528198 8.93377V393.808C0.528198 398.741 4.52767 402.742 9.46197 402.742H213.524V334.761Z"
            fill="#F2FBFF"
          />
          <path
            d="M185.984 209.559C189.702 207.994 192.239 204.559 192.66 200.561H93.0244C89.4325 200.561 86.5205 203.472 86.5205 207.064C86.5205 210.657 89.4325 213.568 93.0244 213.568H176.463L185.984 209.559Z"
            fill="#B3DAFE"
          />
          <path
            d="M278.876 0H233.794C238.728 0 242.728 3.99947 242.728 8.93377V43.806H243.914C246.538 43.806 248.666 45.9332 248.666 48.5573V84.1892C248.666 86.8133 246.538 88.9405 243.914 88.9405H242.728V165.69L249.984 157.294C251.748 155.252 254.308 154.08 257.009 154.08C259.709 154.08 262.268 155.252 264.034 157.294L277.434 172.8C279.529 175.224 282.567 176.614 285.77 176.614C286.453 176.614 287.136 176.533 287.81 176.406V8.93377C287.81 3.99947 283.809 0 278.876 0Z"
            fill="#DFF6FD"
          />
          <path
            d="M242.413 140.751H45.9238C42.3319 140.751 39.4199 137.84 39.4199 134.247C39.4199 130.654 42.3319 127.743 45.9238 127.743H242.413C246.006 127.743 248.917 130.654 248.917 134.247C248.917 137.84 246.005 140.751 242.413 140.751Z"
            fill="#B3DAFE"
          />
          <path
            d="M203.65 171.406C204.362 171.406 205.079 171.49 205.781 171.654L225.737 176.322C226.559 176.514 227.404 176.612 228.247 176.612C231.45 176.612 234.489 175.221 236.584 172.798L243.901 164.33C243.422 164.217 242.925 164.152 242.412 164.152H45.9238C42.3319 164.152 39.4199 167.063 39.4199 170.656C39.4199 174.249 42.3319 177.16 45.9238 177.16H195.095C196.502 173.782 199.845 171.406 203.65 171.406Z"
            fill="#B3DAFE"
          />
          <path
            d="M68.9034 213.567H45.9238C42.3319 213.567 39.4199 210.656 39.4199 207.063C39.4199 203.471 42.3319 200.56 45.9238 200.56H68.9034C72.4953 200.56 75.4073 203.471 75.4073 207.063C75.4073 210.656 72.4953 213.567 68.9034 213.567Z"
            fill="#B3DAFE"
          />
          <path
            d="M173.361 248.411L166.443 236.972H45.9238C42.3319 236.972 39.4199 239.883 39.4199 243.476C39.4199 247.068 42.3319 249.979 45.9238 249.979H174.142C173.924 249.443 173.667 248.917 173.361 248.411Z"
            fill="#B3DAFE"
          />
          <path
            d="M133.263 332.214L111.804 321.287C106.851 325.956 100.184 328.826 92.855 328.826C85.8178 328.826 79.3902 326.18 74.5036 321.836L54.123 332.213C49.0924 334.774 45.9246 339.941 45.9246 345.587V357.51C45.9246 359.145 47.2496 360.47 48.8834 360.47H138.502C140.137 360.47 141.462 359.145 141.462 357.51V345.587C141.461 339.943 138.294 334.775 133.263 332.214Z"
            fill="#B3DAFE"
          />
          <path
            d="M133.263 332.214L111.804 321.287C107.666 325.186 102.333 327.824 96.4189 328.591L103.535 332.214C108.566 334.775 111.733 339.942 111.733 345.587V357.511C111.733 359.146 110.408 360.471 108.774 360.471H138.503C140.137 360.471 141.462 359.146 141.462 357.511V345.587C141.461 339.943 138.294 334.775 133.263 332.214Z"
            fill="#8AC9FE"
          />
          <path
            d="M121.484 301.97C121.971 286.233 109.61 273.081 93.8738 272.593C78.1374 272.105 64.9851 284.467 64.4973 300.203C64.0095 315.939 76.3708 329.092 92.1072 329.58C107.844 330.067 120.996 317.706 121.484 301.97Z"
            fill="#8AC9FE"
          />
          <path
            d="M92.8541 272.679C88.7679 272.679 84.8855 273.545 81.3726 275.095C91.3886 279.511 98.3842 289.522 98.3842 301.172C98.3842 312.822 91.3886 322.833 81.3726 327.249C84.8855 328.799 88.7679 329.665 92.8541 329.665C108.591 329.665 121.347 316.908 121.347 301.172C121.348 285.436 108.591 272.679 92.8541 272.679Z"
            fill="#60B7FF"
          />
          <path
            d="M243.914 88.9402H44.4236C41.7995 88.9402 39.6722 86.813 39.6722 84.1889V48.557C39.6722 45.9329 41.7995 43.8057 44.4236 43.8057H243.914C246.538 43.8057 248.665 45.9329 248.665 48.557V84.1889C248.664 86.813 246.537 88.9402 243.914 88.9402Z"
            fill="#26A6FE"
          />
          <path
            d="M243.913 43.8057H203.794C206.419 43.8057 208.546 45.9329 208.546 48.557V84.1889C208.546 86.813 206.419 88.9402 203.794 88.9402H243.913C246.537 88.9402 248.664 86.813 248.664 84.1889V48.5561C248.664 45.9329 246.537 43.8057 243.913 43.8057Z"
            fill="#0593FC"
          />
          <path
            d="M288.279 331.903C287.457 331.71 286.612 331.613 285.77 331.613C282.567 331.613 279.528 333.003 277.432 335.426L264.033 350.932C262.268 352.975 259.708 354.146 257.008 354.146C254.307 354.146 251.748 352.975 249.982 350.932L236.584 335.427C234.488 333.003 231.449 331.614 228.246 331.614C227.403 331.614 226.56 331.711 225.737 331.904L212.657 334.963V439.526C212.657 442.916 216.285 445.071 219.262 443.448L254.87 424.032C256.203 423.305 257.814 423.305 259.147 424.032L294.754 443.448C297.731 445.07 301.36 442.916 301.36 439.526V334.963L288.279 331.903Z"
            fill="#E7F8DB"
          />
          <path
            d="M288.279 331.903C287.457 331.71 286.613 331.613 285.77 331.613C282.567 331.613 279.529 333.003 277.433 335.426L271.062 342.798V430.529L294.754 443.447C297.73 445.069 301.359 442.915 301.359 439.525V334.963L288.279 331.903Z"
            fill="#E7F8DB"
          />
          <path
            d="M264.689 156.724L278.09 172.23C280.558 175.086 284.407 176.337 288.083 175.477L308.038 170.809C314.068 169.399 319.944 173.668 320.466 179.838L322.193 200.259C322.512 204.02 324.89 207.295 328.369 208.76L347.258 216.713C352.965 219.116 355.209 226.024 352.005 231.322L341.399 248.858C339.445 252.089 339.445 256.136 341.399 259.365L352.005 276.901C355.209 282.2 352.965 289.108 347.258 291.511L328.369 299.464C324.89 300.929 322.512 304.203 322.193 307.964L320.466 328.386C319.944 334.556 314.068 338.825 308.038 337.415L288.083 332.747C284.407 331.887 280.558 333.138 278.09 335.993L264.689 351.5C260.64 356.184 253.377 356.184 249.328 351.5L235.927 335.993C233.459 333.138 229.61 331.886 225.935 332.747L205.979 337.415C199.949 338.825 194.073 334.556 193.551 328.386L191.824 307.964C191.506 304.203 189.127 300.929 185.648 299.464L166.76 291.511C161.053 289.108 158.808 282.2 162.013 276.901L172.618 259.365C174.572 256.135 174.572 252.088 172.618 248.858L162.013 231.322C158.808 226.024 161.053 219.116 166.76 216.713L185.648 208.76C189.127 207.295 191.506 204.02 191.824 200.259L193.551 179.838C194.073 173.668 199.949 169.399 205.979 170.809L225.935 175.477C229.61 176.336 233.459 175.086 235.927 172.23L249.328 156.724C253.377 152.039 260.64 152.039 264.689 156.724Z"
            fill="#E7F8DB"
          />
          <circle cx={257} cy={255} r={50} fill="white" />
          <path
            d="M314.34 240.246C312.131 237.938 309.846 235.559 308.984 233.467C308.188 231.551 308.141 228.375 308.094 225.299C308.006 219.58 307.912 213.1 303.406 208.594C298.9 204.088 292.42 203.994 286.701 203.906C283.625 203.859 280.449 203.812 278.533 203.016C276.447 202.154 274.062 199.869 271.754 197.66C267.711 193.775 263.117 189.375 257 189.375C250.883 189.375 246.295 193.775 242.246 197.66C239.938 199.869 237.559 202.154 235.467 203.016C233.562 203.812 230.375 203.859 227.299 203.906C221.58 203.994 215.1 204.088 210.594 208.594C206.088 213.1 206.023 219.58 205.906 225.299C205.859 228.375 205.812 231.551 205.016 233.467C204.154 235.553 201.869 237.938 199.66 240.246C195.775 244.289 191.375 248.883 191.375 255C191.375 261.117 195.775 265.705 199.66 269.754C201.869 272.062 204.154 274.441 205.016 276.533C205.812 278.449 205.859 281.625 205.906 284.701C205.994 290.42 206.088 296.9 210.594 301.406C215.1 305.912 221.58 306.006 227.299 306.094C230.375 306.141 233.551 306.188 235.467 306.984C237.553 307.846 239.938 310.131 242.246 312.34C246.289 316.225 250.883 320.625 257 320.625C263.117 320.625 267.705 316.225 271.754 312.34C274.062 310.131 276.441 307.846 278.533 306.984C280.449 306.188 283.625 306.141 286.701 306.094C292.42 306.006 298.9 305.912 303.406 301.406C307.912 296.9 308.006 290.42 308.094 284.701C308.141 281.625 308.188 278.449 308.984 276.533C309.846 274.447 312.131 272.062 314.34 269.754C318.225 265.711 322.625 261.117 322.625 255C322.625 248.883 318.225 244.295 314.34 240.246ZM283.754 244.254L250.941 277.066C250.506 277.502 249.989 277.848 249.42 278.084C248.851 278.32 248.241 278.441 247.625 278.441C247.009 278.441 246.399 278.32 245.83 278.084C245.261 277.848 244.744 277.502 244.309 277.066L230.246 263.004C229.811 262.568 229.465 262.051 229.229 261.482C228.994 260.913 228.872 260.303 228.872 259.688C228.872 259.072 228.994 258.462 229.229 257.893C229.465 257.324 229.811 256.807 230.246 256.371C231.126 255.492 232.319 254.997 233.562 254.997C234.178 254.997 234.788 255.119 235.357 255.354C235.926 255.59 236.443 255.936 236.879 256.371L247.625 267.123L277.121 237.621C277.557 237.186 278.074 236.84 278.643 236.604C279.212 236.369 279.822 236.247 280.438 236.247C281.053 236.247 281.663 236.369 282.232 236.604C282.801 236.84 283.318 237.186 283.754 237.621C284.189 238.057 284.535 238.574 284.771 239.143C285.006 239.712 285.128 240.322 285.128 240.938C285.128 241.553 285.006 242.163 284.771 242.732C284.535 243.301 284.189 243.818 283.754 244.254Z"
            fill="#009955"
          />
          <path
            d="M341.397 259.367C339.443 256.136 339.443 252.089 341.397 248.86L352.003 231.324C355.208 226.025 352.963 219.117 347.256 216.714L328.368 208.761C324.889 207.296 322.51 204.022 322.192 200.261L320.466 179.839C319.944 173.669 314.067 169.4 308.038 170.81L295.033 173.852C296.485 175.439 297.454 177.502 297.652 179.839L299.379 200.261C299.697 204.023 302.076 207.296 305.555 208.761L324.443 216.714C330.15 219.117 332.395 226.025 329.19 231.324L318.585 248.86C316.631 252.09 316.631 256.137 318.585 259.367L329.19 276.903C332.395 282.201 330.15 289.109 324.443 291.512L305.555 299.465C302.076 300.93 299.697 304.205 299.379 307.966L297.652 328.387C297.454 330.725 296.485 332.787 295.033 334.374L308.038 337.416C314.067 338.827 319.944 334.557 320.466 328.387L322.192 307.966C322.51 304.204 324.889 300.93 328.368 299.465L347.256 291.512C352.963 289.109 355.208 282.201 352.003 276.903L341.397 259.367Z"
            fill="#E7F8DB"
          />
        </svg>
      </div>
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-800 font-medium text-xl">
            Verify certificate
          </h1>
          <span className="text-gray-700 w-3/4">
            To verify the authenticity of a certificate, compare its details
            with the presented copy.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-800 font-medium">Certificate ID</span>
          <Input
            onInput={(e) => setCertificateId(e.currentTarget.value)}
            placeholder="Enter certificate ID"
            className="w-3/4 rounded-none bg-gray-100 border border-gray-400"

          />
        </div>
        <Button
          className="bg-basePrimary w-3/4 rounded-none py-4"
          disabled={certificateId.length < 18}
          onClick={onSubmit}
        >
          Verify
        </Button>
      </div>
    </section>
  );
};

export default Page;
