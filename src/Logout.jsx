import React from 'react';



export const Logout = () => {
  localStorage.clear();
  return (
    <>
    <div className="logout">
      <h2>Goodbye!</h2>
      <p>See you soon.</p>
    </div>
</>
  );
};
