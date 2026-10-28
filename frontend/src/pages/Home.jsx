import React from "react";
import Navbar from "../sections/Navbar";
import Hero from "../sections/Hero";
import Menu from "../sections/Menu";
import Order from "../sections/Order";
import Bonds from "../sections/Bonds";
import Contact from "../sections/Contact";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Menu />
      <Order />
      <Contact />
    </div>
  );
};

export default Home;
