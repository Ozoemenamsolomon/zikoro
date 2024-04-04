"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function TermsBody() {
  const links = [
    {
      name: "Terms Of Use",
      id: "terms",
    },
    {
      name: "Privacy Policy",
      id: "privacy-policy",
    },
    {
      name: "Refund Policy",
      id: "refund-policy",
    },
    {
      name: "Cookies",
      id: "cookies",
    },
   
  ];

  const pathname = usePathname();

  
  return (
    <div className=" mt-24 lg:mt-48 px-5 lg:px-0">
      <div className="max-w-4xl mx-auto">
        <p className=" text-3xl lg:text-5xl  font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end  text-center">
          {" "}
          Welcome to Our Legal Page.
        </p>
        <p className="max-w-full lg:max-w-3xl mx-auto text-center  text-base lg:text-2xl font-normal mt-5 lg:mt-10">
          We extend a warm welcome to you as you peruse our legal documentation.
          Here, you'll find comprehensive information regarding our services and
          associated terms. Should you have any inquiries, please feel free to
          reach out to us at your convenience. 
        </p>

        <div className="flex mt-[50px] text-center items-center justify-center gap-x-4">
        

          <div className=" grid grid-cols-2 lg:grid-cols-4 gap-5">
                {links.map(({ name, id }, index) => {
                  return (
                    <Link
                      key={index}
                      href={`/terms-and-condition/#${id}`}
                      className={` ${
                        pathname === `/terms-and-condition/#${id}`
                          ? "text-zikoroBlue text-lg font-medium px-4"
                          : "px-4 text-base font-medium"
                      }`}
                    >
                      {name}
                    </Link>
                  );
                })}
              </div>
        </div>
      </div>
      {/* header section */}
      <div className="max-w-6xl mx-auto pt-24 pb-32">
        <div className="" id="terms">
          <p className="text-xl lg:text-3xl font-bold ">Terms of Use</p>
          <p className="text-base lg:text-xl font-normal pt-4">
            {" "}
            Last updated ________
          </p>
        </div>

        {/* body section */}
        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            Agreement To Our Legal Terms
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We are Zikoro ('Company', 'we', 'us', or 'our'). <br /> We
            operate the website zikoro.com (the 'Site'), as well as any other
            related products and services that refer or link to these legal
            terms (the 'Legal Terms') (collectively, the 'Services'). <br /> You
            can contact us by email at __________ or by mail
            to __________, __________, __________. <br />
            These Legal Terms constitute a legally binding agreement made
            between you, whether personally or on behalf of an entity ('you'),
            and Zikoro, concerning your access to and use of the Services. You
            agree that by accessing the Services, you have read, understood, and
            agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE
            WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED
            FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.{" "}
            <br /> Supplemental terms and conditions or documents that may be
            posted on the Services from time to time are hereby expressly
            incorporated herein by reference. We reserve the right, in our sole
            discretion, to make changes or modifications to these Legal
            Terms from time to time. We will alert you about any changes by
            updating the 'Last updated' date of these Legal Terms, and you waive
            any right to receive specific notice of each such change. It is your
            responsibility to periodically review these Legal Terms to stay
            informed of updates. You will be subject to, and will be deemed to
            have been made aware of and to have accepted, the changes in any
            revised Legal Terms by your continued use of the Services after the
            date such revised Legal Terms are posted. <br /> The Services are
            intended for users who are at least 13 years of age. All users who
            are minors in the jurisdiction in which they reside (generally under
            the age of 18) must have the permission of, and be directly
            supervised by, their parent or guardian to use the Services. If you
            are a minor, you must have your parent or guardian read and agree to
            these Legal Terms prior to you using the Services.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">1. OUR SERVICES</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            The information provided when using the Services is not intended for
            distribution to or use by any person or entity in any jurisdiction
            or country where such distribution or use would be contrary to law
            or regulation or which would subject us to any registration
            requirement within such jurisdiction or country. Accordingly, those
            persons who choose to access the Services from other locations do so
            on their own initiative and are solely responsible for compliance
            with local laws, if and to the extent local laws are applicable.
            __________
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            2. INTELLECTUAL PROPERTY RIGHTS
          </p>
          <p className="text-base lg:text-xl font-semibold mt-6">
            {" "}
            Our intellectual property
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            {" "}
            We are the owner or the licensee of all intellectual property rights
            in our Services, including all source code, databases,
            functionality, software, website designs, audio, video, text,
            photographs, and graphics in the Services (collectively,
            the 'Content'), as well as the trademarks, service marks, and logos
            contained therein (the 'Marks').
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            {" "}
            Our Content and Marks are protected by copyright and trademark laws
            (and various other intellectual property rights and unfair
            competition laws) and treaties in the United States and around the
            world.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            {" "}
            The Content and Marks are provided in or through the Services 'AS
            IS' for your personal, non-commercial use or internal business
            purpose only.
          </p>

          <p className="text-base lg:text-xl font-semibold mt-6">
            {" "}
            Your use of our Services
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            {" "}
            Subject to your compliance with these Legal Terms, including
            the 'PROHIBITED ACTIVITIES' section below, we grant you a
            non-exclusive, non-transferable, revocable licence to: <br />
            <br />
            1. access the Services; and <br />
            2. download or print a copy of any portion of the Content to which
            you have properly gained access. <br />
            <br />
            solely for your personal, non-commercial use or internal business
            purpose. <br />
            Except as set out in this section or elsewhere in our Legal Terms,
            no part of the Services and no Content or Marks may be copied,
            reproduced, aggregated, republished, uploaded, posted, publicly
            displayed, encoded, translated, transmitted, distributed, sold,
            licensed, or otherwise exploited for any commercial purpose
            whatsoever, without our express prior written permission. <br />
            If you wish to make any use of the Services, Content, or Marks other
            than as set out in this section or elsewhere in our Legal Terms,
            please address your request to: __________. If we ever grant you the
            permission to post, reproduce, or publicly display any part of our
            Services or Content, you must identify us as the owners or licensors
            of the Services, Content, or Marks and ensure that any copyright or
            proprietary notice appears or is visible on posting, reproducing, or
            displaying our Content. <br />
            We reserve all rights not expressly granted to you in and to the
            Services, Content, and Marks. <br />
            Any breach of these Intellectual Property Rights will constitute a
            material breach of our Legal Terms and your right to use our
            Services will terminate immediately. <br />
          </p>

          <p className="text-base lg:text-xl font-semibold mt-6">
            {" "}
            Your submissions and contributions
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            Please review this section and the 'PROHIBITED ACTIVITIES' section
            carefully prior to using our Services to understand the (a) rights
            you give us and (b) obligations you have when you post or upload any
            content through the Services.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            Please review this section and the 'PROHIBITED ACTIVITIES' section
            carefully prior to using our Services to understand the (a) rights
            you give us and (b) obligations you have when you post or upload any
            content through the Services.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            <span className="font-semibold">Submissions:</span>  By directly
            sending us any question, comment, suggestion, idea, feedback, or
            other information about the Services ("Submissions"), you agree to
            assign to us all intellectual property rights in such Submission.
            You agree that we shall own this Submission and be entitled to its
            unrestricted use and dissemination for any lawful purpose,
            commercial or otherwise, without acknowledgment or compensation to
            you. <br />
            <span className="font-semibold">Contributions:</span>   The Services
            may invite you to chat, contribute to, or participate in blogs,
            message boards, online forums, and other functionality during which
            you may create, submit, post, display, transmit, publish,
            distribute, or broadcast content and materials to us or through the
            Services, including but not limited to text, writings, video, audio,
            photographs, music, graphics, comments, reviews, rating suggestions,
            personal information, or other material ('Contributions'). Any
            Submission that is publicly posted shall also be treated as a
            Contribution. <br />
            You understand that Contributions may be viewable by other users of
            the Services and possibly through third-party websites. <br />
            <span className="font-semibold mt-8">
              When you post Contributions, you grant us a licence (including use
              of your name, trademarks, and logos):
            </span>
             By posting any Contributions, you grant us an unrestricted,
            unlimited, irrevocable, perpetual, non-exclusive, transferable,
            royalty-free, fully-paid, worldwide right, and licence to: use,
            copy, reproduce, distribute, sell, resell, publish, broadcast,
            retitle, store, publicly perform, publicly display, reformat,
            translate, excerpt (in whole or in part), and exploit your
            Contributions (including, without limitation, your image, name, and
            voice) for any purpose, commercial, advertising, or otherwise, to
            prepare derivative works of, or incorporate into other works, your
            Contributions, and to sublicence the licences granted in this
            section. Our use and distribution may occur in any media formats and
            through any media channels. <br /> You are responsible for what you post or
            upload: By sending us Submissions and/or posting
            Contributions through any part of the Services or making
            Contributions accessible through the Services by linking your
            account through the Services to any of your social networking
            accounts, you: <br /> <br className="mt-8"/> 1. confirm that you have read and agree with
            our 'PROHIBITED ACTIVITIES' and will not post, send, publish,
            upload, or transmit through the Services any Submission nor post any
            Contribution that is illegal, harassing, hateful, harmful,
            defamatory, obscene, bullying, abusive, discriminatory, threatening
            to any person or group, sexually explicit, false, inaccurate,
            deceitful, or misleading; <br />to the extent permissible by applicable
            law, waive any and all moral rights to any such Submission and/or
            Contribution; <br /> warrant that any such Submission and/or
            Contributions are original to you or that you have the necessary
            rights and licences to submit such Submissions and/or
            Contributions and <br /> that you have full authority to grant us the
            above-mentioned rights in relation to your Submissions and/or
            Contributions; and warrant and represent that your
            Submissions and/or Contributions do not constitute confidential
            information.  <br className="mt-8" />You are solely responsible for your Submissions and/or
            Contributions and you expressly agree to reimburse us for any and
            all losses that we may suffer because of your breach of (a) this
            section, (b) any third party’s intellectual property rights, or (c)
            applicable law. We may remove or edit your Content: Although we have
            no obligation to monitor any Contributions, we shall have the right
            to remove or edit any Contributions at any time without notice if in
            our reasonable opinion we consider such Contributions harmful or in
            breach of these Legal Terms. If we remove or edit any such
            Contributions, we may also suspend or disable your account and
            report you to the authorities. <br className="mt-8" /> Copyright infringement We respect the
            intellectual property rights of others. If you believe that any
            material available on or through the Services infringes upon any
            copyright you own or control, please immediately refer to
            the 'COPYRIGHT INFRINGEMENTS' section below.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            3. USER REPRESENTATIONS
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            By using the Services, you represent and warrant that: <br />
             (1) you have the legal capacity and you agree to comply with these
            Legal Terms; 
            <br /> (2) you are not a minor in the jurisdiction in which you
            reside; <br />
            (3) you will not access the Services through automated or non-human
            means, whether through a bot, script or otherwise; <br />
            (4) you will not use the Services for any illegal
            or unauthorized purpose; and <br />
            (5) your use of the Services will not violate any applicable law or
            regulation.
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            If you provide any information that is untrue, inaccurate, not
            current, or incomplete, we have the right to suspend or terminate
            your account and refuse any and all current or future use of the
            Services (or any portion thereof).
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">4. USER REGISTRATION</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            You may be required to register to use the Services. You agree to
            keep your password confidential and will be responsible for all use
            of your account and password. We reserve the right to remove,
            reclaim, or change a username you select if we determine, in our
            sole discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">4. USER REGISTRATION</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            You may be required to register to use the Services. You agree to
            keep your password confidential and will be responsible for all use
            of your account and password. We reserve the right to remove,
            reclaim, or change a username you select if we determine, in our
            sole discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">4. USER REGISTRATION</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            You may be required to register to use the Services. You agree to
            keep your password confidential and will be responsible for all use
            of your account and password. We reserve the right to remove,
            reclaim, or change a username you select if we determine, in our
            sole discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">4. USER REGISTRATION</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            You may be required to register to use the Services. You agree to
            keep your password confidential and will be responsible for all use
            of your account and password. We reserve the right to remove,
            reclaim, or change a username you select if we determine, in our
            sole discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">4. USER REGISTRATION</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            You may be required to register to use the Services. You agree to
            keep your password confidential and will be responsible for all use
            of your account and password. We reserve the right to remove,
            reclaim, or change a username you select if we determine, in our
            sole discretion, that such username is inappropriate, obscene, or
            otherwise objectionable.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            9. CONTRIBUTION LICENCE
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            By posting your Contributions to any part of the Services or making
            Contributions accessible to the Services by linking your account
            from the Services to any of your social networking accounts, you
            automatically grant, and you represent and warrant that you have the
            right to grant, to us an unrestricted, unlimited, irrevocable,
            perpetual, non-exclusive, transferable, royalty-free, fully-paid,
            worldwide right, and licence to host, use, copy, reproduce,
            disclose, sell, resell, publish, broadcast, retitle, archive, store,
            cache, publicly perform, publicly display, reformat, translate,
            transmit, excerpt (in whole or in part), and distribute such
            Contributions (including, without limitation, your image and voice)
            for any purpose, commercial, advertising, or otherwise, and to
            prepare derivative works of, or incorporate into other works, such
            Contributions, and grant and authorise sublicences of the foregoing.
            The use and distribution may occur in any media formats and through
            any media channels.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            This licence will apply to any form, media, or technology now known
            or hereafter developed, and includes our use of your name, company
            name, and franchise name, as applicable, and any of the trademarks,
            service marks, trade names, logos, and personal and commercial
            images you provide. You waive all moral rights in your
            Contributions, and you warrant that moral rights have not otherwise
            been asserted in your Contributions.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            We do not assert any ownership over your Contributions. You retain
            full ownership of all of your Contributions and any intellectual
            property rights or other proprietary rights associated with your
            Contributions. We are not liable for any statements or
            representations in your Contributions provided by you in any area on
            the Services. You are solely responsible for your Contributions to
            the Services and you expressly agree to exonerate us from any and
            all responsibility and to refrain from any legal action against us
            regarding your Contributions.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            We have the right, in our sole and absolute discretion, (1) to edit,
            redact, or otherwise change any Contributions; (2)
            to re-categorise any Contributions to place them in more appropriate
            locations on the Services; and (3) to pre-screen or delete any
            Contributions at any time and for any reason, without notice. We
            have no obligation to monitor your Contributions.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            10. GUIDELINES AND REVIEW
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We may provide you areas on the Services to leave reviews or
            ratings. When posting a review, you must comply with the following
            criteria: (1) you should have firsthand experience with the
            person/entity being reviewed; (2) your reviews should not contain
            offensive profanity, or abusive, racist, offensive, or hateful
            language; (3) your reviews should not contain discriminatory
            references based on religion, race, gender, national origin, age,
            marital status, sexual orientation, or disability; (4) your reviews
            should not contain references to illegal activity; (5) you should
            not be affiliated with competitors if posting negative reviews; (6)
            you should not make any conclusions as to the legality of conduct;
            (7) you may not post any false or misleading statements; and (8) you
            may not organise a campaign encouraging others to post reviews,
            whether positive or negative.
          </p>

          <p className="text-base lg:text-xl font-normal mt-6">
            We may accept, reject, or remove reviews in our sole discretion. We
            have absolutely no obligation to screen reviews or to delete
            reviews, even if anyone considers reviews objectionable or
            inaccurate. Reviews are not endorsed by us, and do not necessarily
            represent our opinions or the views of any of our affiliates or
            partners. We do not assume liability for any review or for any
            claims, liabilities, or losses resulting from any review. By posting
            a review, you hereby grant to us a perpetual, non-exclusive,
            worldwide, royalty-free, fully paid, assignable, and sublicensable
            right and licence to reproduce, modify, translate, transmit by any
            means, display, perform, and/or distribute all content relating to
            review.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">11. SOCIAL MEDIA</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            As part of the functionality of the Services, you may link your
            account with online accounts you have with third-party service
            providers (each such account, a 'Third-Party Account') by either:
            (1) providing your Third-Party Account login information through the
            Services; or (2) allowing us to access your Third-Party Account, as
            is permitted under the applicable terms and conditions that govern
            your use of each Third-Party Account. You represent and warrant that
            you are entitled to disclose your Third-Party Account login
            information to us and/or grant us access to
            your Third-Party Account, without breach by you of any of the terms
            and conditions that govern your use of the
            applicable Third-Party Account, and without obligating us to pay any
            fees or making us subject to any usage limitations imposed by the
            third-party service provider of the Third-Party Account. By granting
            us access to any Third-Party Accounts, you understand that (1) we
            may access, make available, and store (if applicable) any content
            that you have provided to and stored in your Third-Party Account
            (the 'Social Network Content') so that it is available on and
            through the Services via your account, including without limitation
            any friend lists and (2) we may submit to and receive from
            your Third-Party Account additional information to the extent you
            are notified when you link your account with
            the Third-Party Account. Depending on the Third-Party Accounts you
            choose and subject to the privacy settings that you have set in
            such Third-Party Accounts, personally identifiable information that
            you post to your Third-Party Accounts may be available on and
            through your account on the Services. Please note that if
            a Third-Party Account or associated service becomes unavailable or
            our access to such Third-Party Account is terminated by the
            third-party service provider, then Social Network Content may no
            longer be available on and through the Services. You will have the
            ability to disable the connection between your account on the
            Services and your Third-Party Accounts at any time. PLEASE NOTE THAT
            YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED
            WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR
            AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS. We make no
            effort to review any Social Network Content for any purpose,
            including but not limited to, for accuracy, legality, or
            non-infringement, and we are not responsible for any Social Network
            Content. You acknowledge and agree that we may access your email
            address book associated with a Third-Party Account and your contacts
            list stored on your mobile device or tablet computer solely for
            purposes of identifying and informing you of those contacts who have
            also registered to use the Services. You can deactivate the
            connection between the Services and your Third-Party Account by
            contacting us using the contact information below or through your
            account settings (if applicable). We will attempt to delete any
            information stored on our servers that was obtained through
            such Third-Party Account, except the username and profile picture
            that become associated with your account.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            12. THIRD-PARTY WEBSITES AND CONTENT
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            The Services may contain (or you may be sent via the Site) links to
            other websites ('Third-Party Websites') as well as articles,
            photographs, text, graphics, pictures, designs, music, sound, video,
            information, applications, software, and other content or items
            belonging to or originating from third parties ('Third-Party
            Content'). Such Third-Party Websites and Third-Party Content are not
            investigated, monitored, or checked for accuracy, appropriateness,
            or completeness by us, and we are not responsible for any
            Third-Party Websites accessed through the Services or
            any Third-Party Content posted on, available through, or installed
            from the Services, including the content, accuracy, offensiveness,
            opinions, reliability, privacy practices, or other policies of or
            contained in the Third-Party Websites or the Third-Party Content.
            Inclusion of, linking to, or permitting the use or installation of
            any Third-Party Websites or any Third-Party Content does not imply
            approval or endorsement thereof by us. If you decide to leave the
            Services and access the Third-Party Websites or to use or install
            any Third-Party Content, you do so at your own risk, and you should
            be aware these Legal Terms no longer govern. You should review the
            applicable terms and policies, including privacy and data gathering
            practices, of any website to which you navigate from the Services or
            relating to any applications you use or install from the Services.
            Any purchases you make through Third-Party Websites will be through
            other websites and from other companies, and we take no
            responsibility whatsoever in relation to such purchases which are
            exclusively between you and the applicable third party. You agree
            and acknowledge that we do not endorse the products or services
            offered on Third-Party Websites and you shall hold us blameless from
            any harm caused by your purchase of such products or services.
            Additionally, you shall hold us blameless from any losses sustained
            by you or harm caused to you relating to or resulting in any way
            from any Third-Party Content or any contact
            with Third-Party Websites.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">13. ADVERTISERS</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We allow advertisers to display their advertisements and other
            information in certain areas of the Services, such as sidebar
            advertisements or banner advertisements. We simply provide the space
            to place such advertisements, and we have no other relationship with
            advertisers.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            14. SERVICES MANAGEMENT
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We reserve the right, but not the obligation, to: <br />
            (1) monitor the Services for violations of these Legal Terms; <br />
            (2) take appropriate legal action against anyone who, in our sole
            discretion, violates the law or these Legal Terms, including without
            limitation, reporting such user to law enforcement authorities;{" "}
            <br />
            (3) in our sole discretion and without limitation, refuse, restrict
            access to, limit the availability of, or disable (to the extent
            technologically feasible) any of your Contributions or any portion
            thereof; <br />
            (4) in our sole discretion and without limitation, notice, or
            liability, to remove from the Services or otherwise disable all
            files and content that are excessive in size or are in any way
            burdensome to our systems; and <br /> (5) otherwise manage the
            Services in a manner designed to protect our rights and property and
            to facilitate the proper functioning of the Services.
          </p>
        </div>

        <div className="mt-[50px]" id="privacy-policy" >
          <p className="text-xl lg:text-3xl font-bold ">15. PRIVACY POLICY</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We care about data privacy and security. By using the Services, you
            agree to be bound by our Privacy Policy posted on the Services,
            which is incorporated into these Legal Terms. Please be advised the
            Services are hosted in Nigeria. If you access the Services from any
            other region of the world with laws or other requirements governing
            personal data collection, use, or disclosure that differ from
            applicable laws in Nigeria, then through your continued use of the
            Services, you are transferring your data to Nigeria, and you
            expressly consent to have your data transferred to and processed
            in Nigeria. Further, we do not knowingly accept, request, or solicit
            information from children or knowingly market to children.
            Therefore, in accordance with the U.S. Children’s Online Privacy
            Protection Act, if we receive actual knowledge that anyone under the
            age of 13 has provided personal information to us without the
            requisite and verifiable parental consent, we will delete that
            information from the Services as quickly as is reasonably practical.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            16. COPYRIGHT INFRINGEMENTS
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We respect the intellectual property rights of others. If you
            believe that any material available on or through the Services
            infringes upon any copyright you own or control, please immediately
            notify us using the contact information provided below
            (a 'Notification'). A copy of your Notification will be sent to the
            person who posted or stored the material addressed in the
            Notification. Please be advised that pursuant to applicable law you
            may be held liable for damages if you make material
            misrepresentations in a Notification. Thus, if you are not sure that
            material located on or linked to by the Services infringes your
            copyright, you should consider first contacting an attorney.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            17. TERM AND TERMINATION
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            These Legal Terms shall remain in full force and effect while you
            use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE
            LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND
            WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES
            (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY
            REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF
            ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL
            TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR
            USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY
            CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING,
            IN OUR SOLE DISCRETION. <br /> If we terminate or suspend your
            account for any reason, you are prohibited from registering and
            creating a new account under your name, a fake or borrowed name, or
            the name of any third party, even if you may be acting on behalf of
            the third party. In addition to terminating or suspending your
            account, we reserve the right to take appropriate legal action,
            including without limitation pursuing civil, criminal, and
            injunctive redress.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">
            18. MODIFICATIONS AND INTERRUPTIONS
          </p>
          <p className="text-base lg:text-xl font-normal mt-6">
            We reserve the right to change, modify, or remove the contents of
            the Services at any time or for any reason at our sole discretion
            without notice. However, we have no obligation to update any
            information on our Services. We will not be liable to you or any
            third party for any modification, price change, suspension, or
            discontinuance of the Services. <br />
            We cannot guarantee the Services will be available at all times. We
            may experience hardware, software, or other problems or need to
            perform maintenance related to the Services, resulting in
            interruptions, delays, or errors. We reserve the right to change,
            revise, update, suspend, discontinue, or otherwise modify the
            Services at any time or for any reason without notice to you. You
            agree that we have no liability whatsoever for any loss, damage, or
            inconvenience caused by your inability to access or use the Services
            during any downtime or discontinuance of the Services. Nothing in
            these Legal Terms will be construed to obligate us to maintain and
            support the Services or to supply any corrections, updates, or
            releases in connection therewith.
          </p>
        </div>

        <div className="mt-[50px]">
          <p className="text-xl lg:text-3xl font-bold ">19. GOVERNING LAW</p>
          <p className="text-base lg:text-xl font-normal mt-6">
            These Legal Terms shall be governed by and defined following the
            laws of __________. Zikoro and yourself irrevocably consent that the
            courts of __________ shall have exclusive jurisdiction to resolve
            any dispute which may arise in connection with these Legal Terms.
          </p>
        </div>
      </div>
    </div>
  );
}
