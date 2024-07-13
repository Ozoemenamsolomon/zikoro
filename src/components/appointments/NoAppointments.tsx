import React from 'react';

const NoAppointments = ({handleClick}:any) => {
  return (
    <section className="flex flex-col items-center justify-center py-20 bg-gray-100 rounded-xl max-w-lg mx-auto p-6">
      <div className="max-w-md w-full text-center bg-white shadow-md rounded-lg p-8">
        <svg className="w-16 h-16 text-purple-100 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m2 7H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2z"></path>
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Appointments</h2>
        <div className="text-gray-600 mb-6">
          {/* <p>There are no future appointments available. </p> */}
          {/* <p>Check your past appointments.</p> */}
        </div>
        {/* <button onClick={handleClick} className="bg-basePrimary hover:shadow-md text-white font-semibold py-2 px-6 rounded shadow-">
          Check Past Appointments
        </button> */}
      </div>
    </section>
  );
};

export default NoAppointments;
