"use client"
import React, { useState } from 'react'
import {toast } from 'react-toastify';
import { supabase } from "@/utils/Utils"

export default function ContactForm() {

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
        "Zimbabwe"
      ];

      const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        city: '',
        country: '',
        email: '',
        phoneNumber: '',
        annualEvents: '',
        attendees: '',
        industry: '',
        comments: ''
      });

      const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const submitForm = async (e:any) => {
        e.preventDefault()
        try {
            const { data, error } = await supabase
              .from('contactForm')
              .insert([formData]);
            if (error) {
              throw error;
            }
            toast.success('Submitted Successfully:', );
            // Optionally, reset form fields after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                city: '',
                country: '',
                email: '',
                phoneNumber: '',
                annualEvents: '',
                attendees: '',
                industry: '',
                comments: ''
            });
          } catch (error) {
            toast.error(`Error submitting contact form: ${error}`);
            console.log(`Error submitting contact form: ${error}`);
          }
    }
    return (
        <div className='bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end mt-28'>
            <div className='max-w-5xl mx-auto pt-24 pb-24 '>
                <div className='border-[1px]  border-white mx-3 lg:mx-0 py-7 px-2 lg:px-8 rounded-md lg:rounded-lg '>
                    <form action="" method="post" className='pb-24 px-7' onSubmit={submitForm}>
                        <p className=' text-xl lg:text-2xl text-center lg:text-left text-white font-bold'>Contact Us</p>

                        <div className='flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row space-x-0 lg:space-x-4 mt-8'>
                            <div className='w-full lg:w-1/2'>
                                <input required type="text" value={formData.firstName} onChange={handleChange} name="firstName" id="" className='w-full h-12 text-base rounded-md border-[1px] border-white bg-transparent text-white placeholder-white px-4 outline-none' placeholder='First Name' />
                            </div>
                            <div className='w-full lg:w-1/2'>
                                <input required value={formData.lastName} type="text" onChange={handleChange} name="lastName" id="" className='w-full h-12 rounded-md border-[1px] border-white bg-transparent text-white placeholder-white px-4 outline-none' placeholder='Last Name' />
                            </div>
                        </div>


                        <div className='flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row space-x-0 lg:space-x-4 mt-3 lg:mt-8'>
                            <select name="country" value={formData.country} onChange={handleChange} id="" className='w-full lg:w-1/2 h-12 bg-transparent rounded-md border-[1px] text-white text-base border-white px-4 outline-none '>
                                <option disabled selected value="" className='bg-transparent text-black'>Select Country</option>
                                {countryList.map((country) => 
                                    <option value={country} className='bg-transparent text-black'>{country}</option>
                                )}
                            </select>

                            <div className='w-full lg:w-1/2'>
                                <input required type="text" onChange={handleChange} value={formData.city} name="city" id="" className='w-full h-12 rounded-md border-[1px] border-white bg-transparent text-white placeholder-white px-4 outline-none' placeholder='City' />
                            </div>
                        </div>


                        <div className='flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row space-x-0 lg:space-x-4 mt-3 lg:mt-8'>
                            <div className='w-full lg:w-1/2'>
                                <input required type="email" onChange={handleChange} value={formData.email} name="email" id="" className='w-full h-12 text-base rounded-md border-[1px] border-white bg-transparent placeholder-white pl-3 outline-none text-white' placeholder='Email' />
                            </div>
                            <div className='w-full lg:w-1/2'>
                                <input required type="text" value={formData.phoneNumber} onChange={handleChange}  name="phoneNumber" placeholder='Phone Number' id="" className='w-full h-12 rounded-md border-[1px] border-white bg-transparent placeholder-white pl-3 outline-none text-white' />
                            </div>
                        </div>

                        <div className='mt-8'>
                            <p className='text-[18px] text-white font-medium'>
                                How many events do you organize annually
                            </p>

                            <div className='space-x-3 mt-5'>
                                <input type="radio" name="annualEvents" value="Only 1" onChange={handleChange} id="" className='text-[12px]' required checked={formData.annualEvents === 'Only 1'}/>
                                <label  htmlFor="" className='text-base text-white font-normal'>Only One</label>
                            </div>

                            <div className='space-x-3 mt-5'>
                                <input type="radio" name="annualEvents" value="2 - 5" onChange={handleChange} id="" className='text-[12px]' required checked={formData.annualEvents === '2 - 5'}/>
                                <label htmlFor="" className='text-base text-white font-normal'>2 - 5 </label>
                            </div>

                            <div className='space-x-3 mt-5'>
                                <input type="radio" name="annualEvents" checked={formData.annualEvents === '6 - 10'} value="6 - 10" onChange={handleChange} id="" className='text-[12px]' required />
                                <label htmlFor="" className='text-base text-white font-normal'>6-10</label>
                            </div>

                            <div className='space-x-3 mt-5'>
                                <input type="radio" name="annualEvents" checked={formData.annualEvents === 'More than 10'} value="More than 10" onChange={handleChange} id="" className='text-[12px]' required />
                                <label htmlFor="" className='text-base text-white font-normal'>More than 10</label>
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-3 lg:gap-y-0 lg:flex-row space-x-0 lg:space-x-4 mt-8 '>
                            <div className='w-full lg:w-1/2'>
                                <input required type="text" onChange={handleChange} value={formData.attendees} name="attendees" id="" className='w-full h-12 text-base rounded-md border-[1px] border-white bg-transparent placeholder-white pl-3 outline-none text-white' placeholder='Number Of Attendees' />
                            </div>
                            <select name="industry" onChange={handleChange} value={formData.industry} id="" className='w-full lg:w-1/2 h-12 bg-transparent rounded-md border-[1px] text-white text-base border-white px-4 outline-none'>
                                <option disabled selected value="" className=''>Select Industry</option>
                                <option  value="Conferences" className='bg-transparent text-black'>Conferences</option>
                                <option  value="Tradeshows & Exhibitions" className='bg-transparent text-black'>Tradeshows & Exhibitions</option>
                                <option  value="Seminars & Workshops" className='bg-transparent text-black'>Seminars & Workshops</option>
                                <option  value="Careers" className='bg-transparent text-black'>Careers</option>
                                <option  value="Education" className='bg-transparent text-black'>Education</option>
                                <option  value="Culture & Arts" className='bg-transparent text-black'>Culture & Arts</option>
                                <option  value="Celebrations" className='bg-transparent text-black'>Celebrations</option>
                                <option  value="Sports" className='bg-transparent text-black'>Sports</option>
                                <option  value="Job Fairs" className='bg-transparent text-black'>Job Fairs</option>
                                <option  value="Festivals" className='bg-transparent text-black'>Festivals</option>
                                <option  value="Charity" className='bg-transparent text-black'>Charity</option>
                            </select>
                        </div>

                        <div className='flex space-x-4 mt-3 lg:mt-8'>
                            <textarea name='comments' value={formData.comments} onChange={handleChange} required id="message" rows={9} className="block p-2.5 w-full text-sm text-white  bg-transparent placeholder-white rounded-md border border-gray-300 focus:outline-none " placeholder="Message"></textarea>

                        </div>

                        {/* Button */}

                        <div className="mt-5 flex items-center justify-center mx-auto">
                            <button type='submit' className="text-white font-montserrat text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 rounded-lg border-[1px] border-white ">Submit</button>
                        </div>
                        <p className='text-[10px] mt-2 text-white text-center'>By clicking the button below, you consent to allow Zikoro to store and process your information by our Privacy Policy</p>

                    </form>
                </div>
                    
            </div>
    </div>  
    )
}