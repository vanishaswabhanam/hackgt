import React from 'react';
import Hero from './ui/neural-network-hero';

export default function ApolloHomePage() {
  return (
    <div className="w-screen h-screen flex flex-col relative">
      {/* APOLLO Header */}
      <div className="absolute top-0 left-0 z-50 p-6">
        <h1 className="text-2xl font-bold text-black">APOLLO</h1>
      </div>
      
      {/* Hero Section with Moving Gradient */}
      <div className="flex-1">
        <Hero 
          title="Where algorithms become art."
          description="A minimal hero with a neural canvas — crisp, elegant, and quietly expressive. Built with React, Three.js, and a custom CPPN shader."
          badgeText="Generative Surfaces"
          badgeLabel="New"
          ctaButtons={[
            { text: "Get started", href: "#get-started", primary: true },
            { text: "View showcase", href: "#showcase" }
          ]}
          microDetails={["Low‑weight font", "Tight tracking", "Subtle motion"]}
        />
      </div>
    </div>
  );
}
