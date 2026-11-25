import React from "react";
import Hero from "../../Components/Header/Hero";
import Catalog from "../../Components/Product/Catalog";

export default function Index() {
  return (
    <>
      <Hero />
      <Catalog id="our-products" title="Our products" />
    </>
  );
}
