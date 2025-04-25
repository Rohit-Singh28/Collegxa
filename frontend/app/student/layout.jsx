import React from "react";
import Footer from "./(components)/Footer";
import Header from "./(components)/Header";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default layout;
