import Attendee from '../../shared/Attendee';
import AttendeesData from '../../data/AttendeesData';

const People=()=>{

    const mappedData= AttendeesData.map(data=>(<Attendee key={data.id} name={data.fullName} job={data.job} time={data?.time} date={data?.date} role1={data.role1} role2={data?.role2}  />))

    return (
        <section>
            <section>
                <div className=" flex py-4 space-between pl-[20px] justify-between ">
                    <p className="font-semibold leading-normal text-greyBlack ">People</p>
                   <div className=" flex space-x-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.54 13V16C10.54 16.2833 10.636 16.521 10.828 16.713C11.02 16.905 11.2574 17.0007 11.54 17C11.8234 17 12.061 16.904 12.253 16.712C12.445 16.52 12.5407 16.2827 12.54 16V13H15.54C15.8234 13 16.061 12.904 16.253 12.712C16.445 12.52 16.5407 12.2827 16.54 12C16.54 11.7167 16.444 11.479 16.252 11.287C16.06 11.095 15.8227 10.9993 15.54 11H12.54V8C12.54 7.71667 12.444 7.479 12.252 7.287C12.06 7.095 11.8227 6.99933 11.54 7C11.2567 7 11.019 7.096 10.827 7.288C10.635 7.48 10.5394 7.71733 10.54 8V11H7.54004C7.25671 11 7.01904 11.096 6.82704 11.288C6.63504 11.48 6.53937 11.7173 6.54004 12C6.54004 12.2833 6.63604 12.521 6.82804 12.713C7.02004 12.905 7.25737 13.0007 7.54004 13H10.54ZM11.54 22C10.1567 22 8.85671 21.7373 7.64004 21.212C6.42337 20.6867 5.36504 19.9743 4.46504 19.075C3.56504 18.175 2.85271 17.1167 2.32804 15.9C1.80337 14.6833 1.54071 13.3833 1.54004 12C1.54004 10.6167 1.80271 9.31667 2.32804 8.1C2.85337 6.88333 3.56571 5.825 4.46504 4.925C5.36504 4.025 6.42337 3.31267 7.64004 2.788C8.85671 2.26333 10.1567 2.00067 11.54 2C12.9234 2 14.2234 2.26267 15.44 2.788C16.6567 3.31333 17.715 4.02567 18.615 4.925C19.515 5.825 20.2277 6.88333 20.753 8.1C21.2784 9.31667 21.5407 10.6167 21.54 12C21.54 13.3833 21.2774 14.6833 20.752 15.9C20.2267 17.1167 19.5144 18.175 18.615 19.075C17.715 19.975 16.6567 20.6877 15.44 21.213C14.2234 21.7383 12.9234 22.0007 11.54 22ZM11.54 20C13.7734 20 15.665 19.225 17.215 17.675C18.765 16.125 19.54 14.2333 19.54 12C19.54 9.76667 18.765 7.875 17.215 6.325C15.665 4.775 13.7734 4 11.54 4C9.30671 4 7.41504 4.775 5.86504 6.325C4.31504 7.875 3.54004 9.76667 3.54004 12C3.54004 14.2333 4.31504 16.125 5.86504 17.675C7.41504 19.225 9.30671 20 11.54 20Z" fill="#15161B"/>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.25 10.5001V19.5001C20.25 19.8979 20.092 20.2795 19.8107 20.5608C19.5294 20.8421 19.1478 21.0001 18.75 21.0001H5.25C4.85218 21.0001 4.47064 20.8421 4.18934 20.5608C3.90804 20.2795 3.75 19.8979 3.75 19.5001V10.5001C3.75 10.1023 3.90804 9.72075 4.18934 9.43944C4.47064 9.15814 4.85218 9.0001 5.25 9.0001H7.5C7.69891 9.0001 7.88968 9.07912 8.03033 9.21977C8.17098 9.36042 8.25 9.55119 8.25 9.7501C8.25 9.94901 8.17098 10.1398 8.03033 10.2804C7.88968 10.4211 7.69891 10.5001 7.5 10.5001H5.25V19.5001H18.75V10.5001H16.5C16.3011 10.5001 16.1103 10.4211 15.9697 10.2804C15.829 10.1398 15.75 9.94901 15.75 9.7501C15.75 9.55119 15.829 9.36042 15.9697 9.21977C16.1103 9.07912 16.3011 9.0001 16.5 9.0001H18.75C19.1478 9.0001 19.5294 9.15814 19.8107 9.43944C20.092 9.72075 20.25 10.1023 20.25 10.5001ZM8.78063 6.53073L11.25 4.06041V12.7501C11.25 12.949 11.329 13.1398 11.4697 13.2804C11.6103 13.4211 11.8011 13.5001 12 13.5001C12.1989 13.5001 12.3897 13.4211 12.5303 13.2804C12.671 13.1398 12.75 12.949 12.75 12.7501V4.06041L15.2194 6.53073C15.3601 6.67146 15.551 6.75052 15.75 6.75052C15.949 6.75052 16.1399 6.67146 16.2806 6.53073C16.4214 6.39 16.5004 6.19912 16.5004 6.0001C16.5004 5.80108 16.4214 5.61021 16.2806 5.46948L12.5306 1.71948C12.461 1.64974 12.3783 1.59443 12.2872 1.55668C12.1962 1.51894 12.0986 1.49951 12 1.49951C11.9014 1.49951 11.8038 1.51894 11.7128 1.55668C11.6217 1.59443 11.539 1.64974 11.4694 1.71948L7.71937 5.46948C7.57864 5.61021 7.49958 5.80108 7.49958 6.0001C7.49958 6.19912 7.57864 6.39 7.71938 6.53073C7.86011 6.67146 8.05098 6.75052 8.25 6.75052C8.44902 6.75052 8.63989 6.67146 8.78063 6.53073Z" fill="#3E404B"/>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="black"/>
                        </svg>
                   </div>
                </div>
                <div className=" flex justify-between">
                    <div className=" flex gap-1 items-center px-4 py-5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 7C14.6326 7 14.7598 6.94732 14.8536 6.85355C14.9473 6.75979 15 6.63261 15 6.5V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H2C1.73478 3 1.48043 3.10536 1.29289 3.29289C1.10536 3.48043 1 3.73478 1 4V6.5C1 6.63261 1.05268 6.75979 1.14645 6.85355C1.24021 6.94732 1.36739 7 1.5 7C1.76522 7 2.01957 7.10536 2.20711 7.29289C2.39464 7.48043 2.5 7.73478 2.5 8C2.5 8.26522 2.39464 8.51957 2.20711 8.70711C2.01957 8.89464 1.76522 9 1.5 9C1.36739 9 1.24021 9.05268 1.14645 9.14645C1.05268 9.24021 1 9.36739 1 9.5V12C1 12.2652 1.10536 12.5196 1.29289 12.7071C1.48043 12.8946 1.73478 13 2 13H14C14.2652 13 14.5196 12.8946 14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12V9.5C15 9.36739 14.9473 9.24021 14.8536 9.14645C14.7598 9.05268 14.6326 9 14.5 9C14.2348 9 13.9804 8.89464 13.7929 8.70711C13.6054 8.51957 13.5 8.26522 13.5 8C13.5 7.73478 13.6054 7.48043 13.7929 7.29289C13.9804 7.10536 14.2348 7 14.5 7ZM14 9.935V12H10.5V10.5H9.5V12H2V9.935C2.428 9.82314 2.80683 9.57253 3.07721 9.2224C3.34759 8.87227 3.49426 8.44238 3.49426 8C3.49426 7.55762 3.34759 7.12773 3.07721 6.7776C2.80683 6.42747 2.428 6.17686 2 6.065V4H9.5V5.5H10.5V4H14V6.065C13.572 6.17686 13.1932 6.42747 12.9228 6.7776C12.6524 7.12773 12.5057 7.55762 12.5057 8C12.5057 8.44238 12.6524 8.87227 12.9228 9.2224C13.1932 9.57253 13.572 9.82314 14 9.935Z" fill="#CFCFCF"/>
<path d="M9.5 6.5H10.5V9.5H9.5V6.5Z" fill="#CFCFCF"/>
</svg>
                        <span className=" text-sm leading-[20.3px] font-normal text-ticketColor ">Ticket type</span>
                        </div>
                    <div className=" border-l-[1px] border-ticketColor  flex gap-1 items-center px-4 my-5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.3245 13.3128C13.3363 11.6053 11.7851 10.4072 9.98259 9.89907C10.8589 9.4536 11.5597 8.72596 11.9719 7.83349C12.3841 6.94102 12.4837 5.93573 12.2547 4.97972C12.0257 4.02371 11.4813 3.1727 10.7094 2.56391C9.93757 1.95511 8.98316 1.62402 8.00009 1.62402C7.01703 1.62402 6.06261 1.95511 5.29074 2.56391C4.51887 3.1727 3.97453 4.02371 3.74549 4.97972C3.51645 5.93573 3.61607 6.94102 4.02828 7.83349C4.44048 8.72596 5.14125 9.4536 6.01759 9.89907C4.21509 10.4066 2.66384 11.6047 1.67572 13.3128C1.64859 13.3555 1.63037 13.4032 1.62216 13.4531C1.61395 13.503 1.61592 13.5541 1.62795 13.6032C1.63999 13.6523 1.66183 13.6985 1.69218 13.739C1.72252 13.7794 1.76073 13.8133 1.80452 13.8387C1.84831 13.864 1.89676 13.8802 1.94697 13.8863C1.99718 13.8924 2.0481 13.8882 2.09667 13.8741C2.14524 13.8601 2.19046 13.8363 2.22961 13.8043C2.26876 13.7722 2.30103 13.7326 2.32447 13.6878C3.52509 11.6134 5.64634 10.3753 8.00009 10.3753C10.3538 10.3753 12.4751 11.6134 13.6757 13.6878C13.6992 13.7326 13.7314 13.7722 13.7706 13.8043C13.8097 13.8363 13.8549 13.8601 13.9035 13.8741C13.9521 13.8882 14.003 13.8924 14.0532 13.8863C14.1034 13.8802 14.1519 13.864 14.1957 13.8387C14.2395 13.8133 14.2777 13.7794 14.308 13.739C14.3384 13.6985 14.3602 13.6523 14.3722 13.6032C14.3843 13.5541 14.3862 13.503 14.378 13.4531C14.3698 13.4032 14.3516 13.3555 14.3245 13.3128ZM4.37509 6.00031C4.37509 5.28336 4.5877 4.5825 4.98602 3.98637C5.38434 3.39024 5.95048 2.92562 6.61287 2.65125C7.27525 2.37688 8.00411 2.3051 8.7073 2.44497C9.41048 2.58484 10.0564 2.93009 10.5634 3.43705C11.0703 3.94402 11.4156 4.58993 11.5554 5.29311C11.6953 5.99629 11.6235 6.72516 11.3492 7.38754C11.0748 8.04992 10.6102 8.61607 10.014 9.01439C9.41791 9.41271 8.71705 9.62531 8.00009 9.62531C7.03904 9.62416 6.11768 9.24187 5.43811 8.5623C4.75854 7.88273 4.37625 6.96137 4.37509 6.00031Z" fill="#CFCFCF"/>
</svg>

                        <span className=" text-sm leading-[20.3px] font-normal text-ticketColor ">Attendees</span>
                        </div>
                    <div className=" border-l-[1px] border-ticketColor  flex gap-1 items-center px-4 my-5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33333 8.32312L8.162 11.1518L13.818 5.49512M2 8.32312L4.82867 11.1518M10.4853 5.49512L8.33333 7.66645" stroke="#CFCFCF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        <span className=" text-sm leading-[20.3px] font-normal text-ticketColor ">Checked-in</span>
                        </div>
                </div>
                <button className=" text-small text-earlyBirdColor flex gap-2.5 p-1.5 rounded-[1px] bg-[#EEF0FF] mx-auto ">
                    <span className="">Early Bird</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M12.6999 3.80682C12.6382 3.74501 12.565 3.69598 12.4843 3.66253C12.4037 3.62907 12.3172 3.61185 12.2299 3.61185C12.1426 3.61185 12.0561 3.62907 11.9755 3.66253C11.8948 3.69598 11.8216 3.74501 11.7599 3.80682L8.49991 7.06015L5.23991 3.80015C5.17818 3.73843 5.10491 3.68947 5.02427 3.65606C4.94362 3.62266 4.85719 3.60547 4.76991 3.60547C4.68262 3.60547 4.59619 3.62266 4.51554 3.65606C4.4349 3.68947 4.36163 3.73843 4.2999 3.80015C4.23818 3.86187 4.18922 3.93514 4.15582 4.01579C4.12242 4.09643 4.10522 4.18286 4.10522 4.27015C4.10522 4.35744 4.12242 4.44387 4.15582 4.52451C4.18922 4.60515 4.23818 4.67843 4.2999 4.74015L7.55991 8.00015L4.2999 11.2601C4.23818 11.3219 4.18922 11.3951 4.15582 11.4758C4.12242 11.5564 4.10522 11.6429 4.10522 11.7301C4.10522 11.8174 4.12242 11.9039 4.15582 11.9845C4.18922 12.0652 4.23818 12.1384 4.2999 12.2001C4.36163 12.2619 4.4349 12.3108 4.51554 12.3442C4.59619 12.3776 4.68262 12.3948 4.76991 12.3948C4.85719 12.3948 4.94362 12.3776 5.02427 12.3442C5.10491 12.3108 5.17818 12.2619 5.23991 12.2001L8.49991 8.94015L11.7599 12.2001C11.8216 12.2619 11.8949 12.3108 11.9755 12.3442C12.0562 12.3776 12.1426 12.3948 12.2299 12.3948C12.3172 12.3948 12.4036 12.3776 12.4843 12.3442C12.5649 12.3108 12.6382 12.2619 12.6999 12.2001C12.7616 12.1384 12.8106 12.0652 12.844 11.9845C12.8774 11.9039 12.8946 11.8174 12.8946 11.7301C12.8946 11.6429 12.8774 11.5564 12.844 11.4758C12.8106 11.3951 12.7616 11.3219 12.6999 11.2601L9.4399 8.00015L12.6999 4.74015C12.9532 4.48682 12.9532 4.06015 12.6999 3.80682Z" fill="#001FCC"/>
                    </svg>
                </button>
                <div className=" flex justify-between px-3.5 mt-10">
                    <div className=" flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
  <path d="M7.03751 10.4017C7.73388 10.007 8.28003 9.39289 8.59075 8.65521C8.90147 7.91752 8.95929 7.09774 8.75519 6.32375C8.55109 5.54975 8.09655 4.86508 7.46248 4.37653C6.82841 3.88799 6.05046 3.62305 5.25001 3.62305C4.44956 3.62305 3.67161 3.88799 3.03754 4.37653C2.40347 4.86508 1.94893 5.54975 1.74483 6.32375C1.54073 7.09774 1.59855 7.91752 1.90927 8.65521C2.21999 9.39289 2.76614 10.007 3.46251 10.4017C2.17187 10.8132 1.06348 11.6587 0.325634 12.7948C0.271265 12.8781 0.252211 12.9796 0.272664 13.0769C0.293117 13.1743 0.351402 13.2595 0.434697 13.3139C0.517991 13.3682 0.619473 13.3873 0.716816 13.3668C0.814159 13.3464 0.89939 13.2881 0.953759 13.2048C1.41914 12.4893 2.05587 11.9013 2.80613 11.4943C3.5564 11.0873 4.39645 10.8741 5.25001 10.8741C6.10357 10.8741 6.94362 11.0873 7.69389 11.4943C8.44415 11.9013 9.08088 12.4893 9.54626 13.2048C9.60417 13.279 9.68788 13.3288 9.78076 13.3441C9.87363 13.3595 9.96889 13.3393 10.0476 13.2877C10.1263 13.236 10.1827 13.1567 10.2056 13.0654C10.2285 12.9741 10.2163 12.8775 10.1713 12.7948C9.4342 11.6593 8.327 10.8138 7.03751 10.4017ZM2.37501 7.24982C2.37501 6.68119 2.54363 6.12534 2.85953 5.65255C3.17544 5.17976 3.62446 4.81126 4.14979 4.59366C4.67513 4.37606 5.2532 4.31913 5.81089 4.43006C6.36859 4.54099 6.88087 4.81481 7.28294 5.21688C7.68502 5.61896 7.95883 6.13124 8.06977 6.68893C8.1807 7.24663 8.12376 7.82469 7.90616 8.35003C7.68856 8.87537 7.32007 9.32438 6.84727 9.64029C6.37448 9.9562 5.81863 10.1248 5.25001 10.1248C4.48782 10.1238 3.75713 9.8206 3.21817 9.28165C2.67922 8.7427 2.376 8.01201 2.37501 7.24982ZM15.5625 13.3123C15.4793 13.3666 15.3779 13.3857 15.2806 13.3653C15.1834 13.3449 15.0982 13.2867 15.0438 13.2036C14.5792 12.488 13.943 11.9 13.193 11.4932C12.443 11.0865 11.6032 10.8739 10.75 10.8748C10.6506 10.8748 10.5552 10.8353 10.4848 10.765C10.4145 10.6947 10.375 10.5993 10.375 10.4998C10.375 10.4004 10.4145 10.305 10.4848 10.2347C10.5552 10.1643 10.6506 10.1248 10.75 10.1248C11.1734 10.1244 11.5914 10.0305 11.9743 9.84976C12.3571 9.66905 12.6954 9.40601 12.9648 9.07944C13.2342 8.75287 13.4282 8.37083 13.5329 7.96061C13.6375 7.55038 13.6503 7.12211 13.5703 6.70637C13.4903 6.29064 13.3194 5.89771 13.0699 5.55566C12.8204 5.21361 12.4985 4.93088 12.1271 4.72766C11.7557 4.52445 11.344 4.40577 10.9214 4.38011C10.4988 4.35444 10.0758 4.42242 9.68251 4.57919C9.63671 4.59794 9.58765 4.60745 9.53816 4.60715C9.48866 4.60685 9.43972 4.59676 9.39415 4.57745C9.34858 4.55815 9.30728 4.53002 9.27263 4.49467C9.23798 4.45933 9.21067 4.41748 9.19228 4.37153C9.17388 4.32559 9.16476 4.27645 9.16545 4.22697C9.16613 4.17748 9.17661 4.12862 9.19627 4.0832C9.21593 4.03778 9.24438 3.9967 9.27999 3.96233C9.31561 3.92796 9.35767 3.90098 9.40376 3.88294C10.2568 3.54286 11.2071 3.5392 12.0627 3.87269C12.9183 4.20618 13.6154 4.85198 14.0133 5.67962C14.4112 6.50725 14.4801 7.45505 14.2062 8.33155C13.9322 9.20804 13.3359 9.94791 12.5375 10.4017C13.8282 10.8132 14.9365 11.6587 15.6744 12.7948C15.728 12.8783 15.7463 12.9797 15.7254 13.0767C15.7044 13.1737 15.6458 13.2584 15.5625 13.3123Z" fill="#717171"/>
</svg>
<p className=" text-small">2/4 attendees listed in your view</p>
                    </div>
                    <div className=" flex items-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
  <path d="M8.98002 5.52021C9.07377 5.61384 9.20085 5.66644 9.33335 5.66644C9.46585 5.66644 9.59294 5.61384 9.68669 5.52021L10.1667 5.04021V11.8335C10.1667 11.9662 10.2194 12.0933 10.3131 12.1871C10.4069 12.2809 10.5341 12.3335 10.6667 12.3335C10.7993 12.3335 10.9265 12.2809 11.0202 12.1871C11.114 12.0933 11.1667 11.9662 11.1667 11.8335V5.04021L11.6467 5.52021C11.6925 5.56934 11.7477 5.60874 11.809 5.63607C11.8703 5.66339 11.9365 5.67809 12.0037 5.67927C12.0708 5.68046 12.1375 5.66811 12.1998 5.64296C12.262 5.61781 12.3186 5.58038 12.366 5.5329C12.4135 5.48542 12.451 5.42887 12.4761 5.36661C12.5012 5.30435 12.5136 5.23766 12.5124 5.17053C12.5112 5.10339 12.4965 5.03719 12.4692 4.97585C12.4419 4.91452 12.4025 4.85932 12.3534 4.81354L11.02 3.48021C10.9263 3.38658 10.7992 3.33398 10.6667 3.33398C10.5342 3.33398 10.4071 3.38658 10.3134 3.48021L8.98002 4.81354C8.88639 4.90729 8.83379 5.03438 8.83379 5.16688C8.83379 5.29938 8.88639 5.42646 8.98002 5.52021ZM5.83335 11.9602L6.31335 11.4802C6.35913 11.4311 6.41433 11.3917 6.47566 11.3644C6.53699 11.337 6.6032 11.3223 6.67034 11.3212C6.73747 11.32 6.80416 11.3323 6.86642 11.3575C6.92868 11.3826 6.98523 11.42 7.03271 11.4675C7.08019 11.515 7.11762 11.5716 7.14277 11.6338C7.16792 11.6961 7.18027 11.7628 7.17908 11.8299C7.1779 11.897 7.1632 11.9632 7.13587 12.0246C7.10855 12.0859 7.06915 12.1411 7.02002 12.1869L5.68669 13.5202C5.59294 13.6138 5.46585 13.6664 5.33335 13.6664C5.20085 13.6664 5.07377 13.6138 4.98002 13.5202L3.64669 12.1869C3.59756 12.1411 3.55816 12.0859 3.53083 12.0246C3.50351 11.9632 3.48881 11.897 3.48763 11.8299C3.48644 11.7628 3.49879 11.6961 3.52394 11.6338C3.54909 11.5716 3.58652 11.515 3.634 11.4675C3.68147 11.42 3.73803 11.3826 3.80029 11.3575C3.86255 11.3323 3.92923 11.32 3.99637 11.3212C4.0635 11.3223 4.12971 11.337 4.19105 11.3644C4.25238 11.3917 4.30758 11.4311 4.35335 11.4802L4.83335 11.9602V5.16688C4.83335 5.03427 4.88603 4.90709 4.9798 4.81332C5.07357 4.71956 5.20075 4.66688 5.33335 4.66688C5.46596 4.66688 5.59314 4.71956 5.68691 4.81332C5.78068 4.90709 5.83335 5.03427 5.83335 5.16688V11.9602Z" fill="#717171"/>
</svg>
<p className=" text-small">A - Z</p>
                    </div>
                </div>
                <div>
                    {mappedData}
                </div>
            </section>
        </section>
    )
}

export default People;