"use client";
import {
  GeneralImageIcon,
  GeometryIcon,
  SocialLinksIcon,
  TrashIcon,
  DashboardXIcon,
  DashboardLinkendinIcon,
  DashboardInstagramIcon,
  DashboardFacebookIcon,
} from "@/constants";
import React, { useEffect, useState } from "react";
import useOrganizationStore from "@/store/globalOrganizationStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useUpdateWorkspace } from "@/hooks/services/workspace";
import { useDeleteWorkspace } from "@/hooks/services/workspace";
import Image from "next/image";

interface FormData {
  orgName: string;
  orgType: string;
  orgPlan: string;
  orgCountry: string;
  orgTel: string;
  orgWhatsappNumber: string;
  orgEmail: string;
  orgX: string;
  orgLinkedin: string;
  orgFacebook: string;
  orgInstagram: string;
}

export default function General() {
  const { organization, setOrganization } = useOrganizationStore();
  const [delInput, setDelInput] = useState<string>("");
  const [logo, setLogo] = useState<any>(null);
  const [favicon, setFavicon] = useState<any>(null);
  const [isLogoUploaded, setIsLogoUploaded] = useState<boolean>(false);
  const [isFaviconUploaded, setIsFaviconUploaded] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [faviconUrl, setFaviconUrl] = useState<string>("");

  const countryList = [
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan (Province of China)",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  //contain form details
  const [formData, setFormData] = useState<FormData>({
    orgName: "",
    orgType: "",
    orgPlan: "",
    orgCountry: "",
    orgTel: "",
    orgWhatsappNumber: "",
    orgEmail: "",
    orgX: "",
    orgLinkedin: "",
    orgFacebook: "",
    orgInstagram: "",
  });

  // import update workspace function
  const { updateWorkspace } = useUpdateWorkspace(
    organization?.id ?? 0,
    formData,
    logoUrl,
    faviconUrl
  );

  //import delete workspace function
  const { deleteWorkspace } = useDeleteWorkspace(formData.orgName);

  // Sync formData with organization data
  useEffect(() => {
    if (organization) {
      setFormData({
        orgName: organization.organizationName || "",
        orgType: organization.organizationType || "",
        orgPlan: organization.subscriptionPlan || "",
        orgCountry: organization.country || "",
        orgTel: organization.eventPhoneNumber || "",
        orgWhatsappNumber: organization.eventWhatsApp || "",
        orgEmail: organization.eventContactEmail || "",
        orgX: organization.x || "",
        orgLinkedin: organization.linkedIn || "",
        orgFacebook: organization.facebook || "",
        orgInstagram: organization.instagram || "",
      });
      setLogoUrl(organization.organizationLogo);
      setFaviconUrl(organization.favicon);

      console.log(organization);
    }
  }, [organization]);

  //update setting function
  const updateSetting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedOrganization = await updateWorkspace();
    if (organization) {
      setFormData({
        orgName: organization.organizationName || "",
        orgType: organization.organizationType || "",
        orgPlan: organization.subscriptionPlan || "",
        orgCountry: organization.country || "",
        orgTel: organization.eventPhoneNumber || "",
        orgWhatsappNumber: organization.eventWhatsApp || "",
        orgEmail: organization.eventContactEmail || "",
        orgX: organization.x || "",
        orgLinkedin: organization.linkedIn || "",
        orgFacebook: organization.facebook || "",
        orgInstagram: organization.instagram || "",
      });
      setLogoUrl(organization.organizationLogo);
      setFaviconUrl(organization.favicon);
      setOrganization(updatedOrganization);
    }
  };

  //preview logo
  const handleLogoPreview = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //preview favicon
  const handleFaviconPreview = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //handles input change
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //Upload Logo Function
  const uploadLogo = async () => {
    const logoFormData = new FormData();
    logoFormData.append("file", logo);
    logoFormData.append("upload_preset", "w5xbik6z");
    logoFormData.append("folder", "ZIKORO");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/zikoro/image/upload`,
        {
          method: "POST",
          body: logoFormData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Image Uploaded");
        setLogoUrl(data.url);
        setIsLogoUploaded(true);
      } else {
        throw new Error("Logo Upload Failed");
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error}`);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  //Upload Favicon Function
  const uploadFavicon = async () => {
    const faviconFormData = new FormData();
    faviconFormData.append("file", favicon);
    faviconFormData.append("upload_preset", "w5xbik6z");
    faviconFormData.append("folder", "ZIKORO");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/zikoro/image/upload`,
        {
          method: "POST",
          body: faviconFormData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast.success("Favicon Uploaded");
        setFaviconUrl(data.url);
        setIsFaviconUploaded(true);
      } else {
        throw new Error("Favicon Upload Failed");
      }
    } catch (error) {
      toast.error(`Error uploading image: ${error}`);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  console.log("org", organization);

  return (
    <>
      {organization ? (
        <div className="">
          <form action="" onSubmit={(e) => updateSetting(e)}>
            <div className="mt-[60px] mb-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px] ">
              <div className="flex justify-between items-center pt-[32px]">
                <div className="flex items-center gap-x-3 ">
                  <GeometryIcon />
                  <p className="text-xl font-semibold">Basic Settings</p>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 text-white text-[14px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-md "
                >
                  Save
                </button>
              </div>

              <div className="mt-8">
                <label className="text-[14px] text-[#1f1f1f]">
                  Workspace Name
                </label>
                <div className="w-full h-[45px] mt-2 ">
                  <input
                    type="text"
                    value={formData.orgName}
                    name="orgName"
                    onChange={(e) => handleInputChange(e)}
                    className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                  />
                </div>
                <p className="mt-2 text-[12px] text-[#1f1f1f]">
                  Events are created inside this workspace. Pick a name that
                  best represents these events.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-[22px] mt-8 ">
                <div className=" w-full lg:w-1/2">
                  <label className="text-[14px] text-[#1f1f1f]">
                    Organization Type
                  </label>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <select
                      name="orgType"
                      value={formData.orgType}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[11px]"
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="private" className="">
                        Private
                      </option>

                      <option value="public" className="">
                        Public
                      </option>
                    </select>
                  </div>
                </div>

                <div className=" w-full lg:w-1/2">
                  <p className="text-[14px] text-[#1f1f1f]">Pricing Plan</p>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <select
                      name="orgPlan"
                      value={formData.orgPlan}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[11px]"
                    >
                      <option value="free" className="">
                        Free
                      </option>
                      <option value="lite" className="">
                        Lite
                      </option>
                      <option value="professional" className="">
                        Professional
                      </option>
                      <option value="enterprise" className="">
                        Enterprise
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[22px] mt-8 ">
                <div className=" w-full lg:w-1/2">
                  <p className="text-[14px] text-[#1f1f1f]">Country</p>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <select
                      name="orgCountry"
                      value={formData.orgCountry}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end text-[14px] text-[#1f1f1f] outline-none px-[10px] py-[11px]"
                    >
                      {countryList.map((country) => (
                        <option
                          key={country}
                          value={country}
                          className="bg-transparent text-black"
                          onChange={(e) => handleInputChange(e)}
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className=" w-full lg:w-1/2">
                  <p className="text-[14px] text-[#1f1f1f]">Phone Number</p>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <input
                      type="tel"
                      value={formData.orgTel}
                      onChange={(e) => handleInputChange(e)}
                      name="orgTel"
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[22px] mt-8 ">
                <div className=" w-full lg:w-1/2">
                  <p className="text-[14px] text-[#1f1f1f]">Whatsapp Number</p>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <input
                      type="tel"
                      value={formData.orgWhatsappNumber}
                      name="orgWhatsappNumber"
                      onChange={handleInputChange}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                    />
                  </div>
                </div>

                <div className=" w-full lg:w-1/2">
                  <p className="text-[14px] text-[#1f1f1f]">Email</p>
                  <div className="w-full h-[45px] mt-2 text-[15px] text-[#1f1f1f]">
                    <input
                      type="email"
                      value={formData.orgEmail}
                      name="orgEmail"
                      onChange={handleInputChange}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row mt-8 px-0  xl:px-[206px] gap-[52px] mb-8">
                <div className="w-full lg:w-full xl:w-1/2">
                  <p className="text-base font-medium">Logo</p>
                  <p className="text-[14px] font-normal mt-2 h-full lg:h-[79px]">
                    The logo will be used on the event website, in emails, and
                    as a thumbnail for sharing the event link.
                  </p>

                  {logo ? (
                    <div className="relative mt-4">
                      <img
                        src={logo}
                        alt="logo"
                        className="w-full h-[321px] object-cover rounded-lg"
                      />

                      {!isLogoUploaded && (
                        <>
                          <button
                            className="absolute text-[13px] top-3 right-2 font-bold bg-white text-indigo-600 px-2 py-[2px] rounded-full"
                            onClick={() => setLogo(null)}
                          >
                            x
                          </button>

                          <p
                            onClick={() => uploadLogo()}
                            className=" cursor-pointer absolute text-[13px] top-3 right-10 font-bold bg-white text-indigo-600 px-2 py-[2px] rounded-full"
                          >
                            Upload Now
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end h-[321px] items-center justify-center flex flex-col border-[1px] border-indigo-600 rounded-lg mt-4 ">
                      <label className="bg-white flex items-center gap-x-2 border-[1px] border-white p-2 rounded-[32px] cursor-pointer ">
                        <GeneralImageIcon />
                        <p>Upload Logo</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoPreview}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[12px] mt-4">
                        {" "}
                        Logo size should be 50px by 50px
                      </p>
                      <p className="text-[12px] mt-4 font-semibold">Current Logo</p>
                      <img
                        src={organization.organizationLogo}
                        alt="logo"
                        className="w-[50px] h-[50px] rounded-full mt-4"
                      />
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-full xl:w-1/2">
                  <p className="text-base font-medium">Favicon</p>
                  <p className="text-[14px] font-normal mt-2 h-full lg:h-[79px]">
                    A favicon is a visual representation of your organization's
                    webpage and appears in the browser tab when viewed.
                  </p>

                  {favicon ? (
                    <div className="relative mt-4">
                      <img
                        src={favicon}
                        alt="favicon"
                        className="w-full h-[321px] object-cover rounded-lg"
                      />

                      {!isFaviconUploaded && (
                        <>
                          <button
                            className="absolute text-[13px] top-3 right-2 font-bold bg-white text-indigo-600 px-2 py-[2px] rounded-full"
                            onClick={() => setFavicon(null)}
                          >
                            x
                          </button>

                          <p
                            onClick={() => uploadFavicon()}
                            className=" cursor-pointer absolute text-[13px] top-3 right-10 font-bold bg-white text-indigo-600 px-2 py-[2px] rounded-full"
                          >
                            Upload Now
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end h-[321px] items-center justify-center flex flex-col border-[1px] border-indigo-600 rounded-lg mt-4 ">
                      <label className="bg-white flex items-center gap-x-2 border-[1px] border-white p-2 rounded-[32px] cursor-pointer ">
                        <GeneralImageIcon />
                        <p>Upload Favicon</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconPreview}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[12px] mt-4">
                        {" "}
                        Favicon size should be 16px by 16px
                      </p>
                      <p className="text-[12px] mt-4 font-semibold">Current Favicon</p>
                      <img
                        src={organization.organizationLogo}
                        alt="logo"
                        className="w-[50px] h-[50px] rounded-full mt-4"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 mb-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px]">
              <div className="flex items-center gap-x-3 pt-[32px]">
                <SocialLinksIcon />
                <p className="text-xl font-semibold">Social Media Links</p>
              </div>

              <div className="mt-8 flex items-center gap-x-2 w-full">
                <div className="mt-8">
                  <DashboardXIcon />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] text-[#1f1f1f]">Twitter</label>
                  <div className="w-full h-[45px] mt-2 ">
                    <input
                      type="text"
                      value={formData.orgX}
                      name="orgX"
                      placeholder="Enter Link"
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-x-2 w-full">
                <div className="mt-8">
                  <DashboardLinkendinIcon />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] text-[#1f1f1f]">
                    LinkendIn
                  </label>
                  <div className="w-full h-[45px] mt-2 ">
                    <input
                      type="text"
                      value={formData.orgLinkedin}
                      name="orgLinkedin"
                      placeholder="Enter Link"
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-x-2 w-full">
                <div className="mt-8">
                  <DashboardFacebookIcon />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] text-[#1f1f1f]">Facebook</label>
                  <div className="w-full h-[45px] mt-2 ">
                    <input
                      type="text"
                      value={formData.orgFacebook}
                      name="orgFacebook"
                      placeholder="Enter Link"
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-x-2 w-full">
                <div className="mt-8">
                  <DashboardInstagramIcon />
                </div>
                <div className="flex-1">
                  <label className="text-[14px] text-[#1f1f1f]">
                    Instagram
                  </label>
                  <div className="w-full h-[45px] mt-2 ">
                    <input
                      type="text"
                      value={formData.orgInstagram}
                      name="orgInstagram"
                      placeholder="Enter Link"
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-8 ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px] py-8 mb-16 lg:mb-2 ">
            <div className="flex gap-x-3">
              <TrashIcon size={20} />
              <p className="font-semibold ">Delete Workspace</p>
            </div>
            <p className="mt-[10px] text-base font-medium">
              Deleting a portal will remove all events in the portal and you
              will no longer be able to retrieve them.
            </p>
            <div className="flex justify-center lg:justify-end mt-8 ">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="py-2 px-4 text-white text-[15px] bg-[#E74C3C] font-medium rounded-md ">
                    Delete Workspace
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="boder-[1px] border-gray-200 pb-2">
                      Delete Your Workspace
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete this workspace. Please enter
                      <span className="font-semibold">
                        {" "}
                        {organization?.organizationName}{" "}
                      </span>
                      to confirm deletion
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    <input
                      type="text"
                      value={delInput}
                      name="delInput"
                      placeholder="Enter workspace name"
                      className="w-full h-[37px] rounded-xl border-[1px] border-gray-200  to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f] placeholder-gray-400"
                      onChange={(e) => setDelInput(e.target.value)}
                    />
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <button
                        disabled={delInput != organization.organizationName}
                        type="button"
                        onClick={() => {
                          deleteWorkspace();
                        }}
                        className="bg-[#E74C3C] text-white py-1 w-full text-[15px] cursor-pointer  font-medium rounded-md "
                      >
                        Delete
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm">No organization found, please create one</p>
      )}
    </>
  );
}
