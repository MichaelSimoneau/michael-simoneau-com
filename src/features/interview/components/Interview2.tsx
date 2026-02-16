import React from 'react';
import { motion } from 'framer-motion';
import { MainNav } from '../../../layout/MainNav';
import { Seo } from '../../../foundation/seo/Seo';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '../../../backgrounds/AnimatedBackground';

export const Interview2: React.FC = () => {
  return (
    <>
      <Seo
        title="Interview Session 2: From Code to Architecture | Michael Simoneau"
        description="Michael Simoneau on building a factory instead of a boat: EtherHive, deterministic engineering for AI, and why the settlement membrane changes everything. Part 2 of the interview series."
        canonicalUrl="https://www.michaelsimoneau.com/interview/2"
        keywords={[
          "Michael Simoneau Interview",
          "EtherHive",
          "Factory vs Boat",
          "Deterministic Engineering",
          "Settlement Membrane",
          "Asymmetric Dependency",
          "AI Systems Architecture",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Interview Session 2: From Code to Architecture',
          description: 'Building systems for AI: factory, wizard, and the settlement membrane',
          author: {
            '@type': 'Person',
            name: 'Michael Simoneau',
            url: 'https://www.michaelsimoneau.com',
          },
        }}
      />
      <AnimatedBackground />
      <MainNav />
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
        <section className="min-h-screen text-white py-20 px-4 pt-24">
          <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-cyan-400 mb-8 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
              <Link to="/interview" className="hover:text-cyan-400 transition-colors">Part 1: The Foundation</Link>
              <span className="text-gray-600">|</span>
              <span className="text-cyan-400">Part 2: From Code to Architecture</span>
              <span className="text-gray-600">|</span>
              <Link to="/interview/3" className="hover:text-cyan-400 transition-colors">Part 3: Zeroth & the Digital Organism</Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              <span className="block text-cyan-400">An Interview with Michael Simoneau</span>
              <span className="block text-2xl md:text-3xl mt-4">Session 2: From Code to Architecture</span>
            </h1>

            <div className="space-y-8">
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Interview Session 2: From Code to Architecture</h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-semibold mb-2">When did you first think about building a factory instead of a boat?</p>
                    <p className="text-gray-300">I looked at the volatility of web3 and said: betting everything on one vessel is the wrong approach. I realized you shouldn&apos;t be the one sailing the boat—you should own the shipyard. So I shifted from the output to the means of production. I&apos;m not building missiles on boats; I&apos;m building a boat factory.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What is the EtherHive in that metaphor?</p>
                    <p className="text-gray-300">It&apos;s the physical factory: a server rack optimized for solar power, designed to produce theoretically infinite products. If one app flops, the factory just prints another. The factory itself is the asset. The dashboard isn&apos;t about user metrics—it&apos;s a control room. Does the factory have power? Does it have connectivity? If those two things are true, the products are inevitable.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">Why funnel everything through a single central logic—the wizard? That sounds like a single point of failure.</p>
                    <p className="text-gray-300">For humans it would be. Humans need redundancy so they can isolate problems and fix them one by one. But the system isn&apos;t designed for humans. It&apos;s designed for an AI. With fifty microservices and logs scattered everywhere, asking an AI to debug is a nightmare—it gets hallucination-prone, loses state. With one central logical failure point, the AI always knows where to look. I&apos;m betting an AI can fix a total system failure faster than a team of humans can fix a partial one. Resolvability over redundancy.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How does the factory talk to Ethereum?</p>
                    <p className="text-gray-300">Ethereum isn&apos;t the brain—it&apos;s the settlement membrane. Think of a cell: the membrane lets nutrients in and waste out but protects what&apos;s inside from chaos. Here, the Zeroth system does all the thinking offchain. Ethereum is the cashier at the end of the assembly line. We hand it the final receipt to stamp. We observe the chain; we don&apos;t rely on it for computational truth.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What happens if Ethereum gets congested or goes down?</p>
                    <p className="text-gray-300">The system waits. It doesn&apos;t crash. It holds transactions in its own memory and keeps processing locally. Blockchain congestion is just bad weather—you wait for the rain to stop. And if the factory has a power outage? The assets already settled on Ethereum are safe. They&apos;re standard ERC20s. The dependency is asymmetric: the factory needs the membrane to export, but the goods already in the world don&apos;t care if the factory burns down.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">You mentioned the system &quot;filters reality.&quot; What does that mean?</p>
                    <p className="text-gray-300">Protocol Zero. The system treats the outside world—user errors, API failures, market crashes—as noise. It filters everything through a plausibility check before accepting it as internal truth. I will only accept data that makes sense according to my internal physics. Everything else is potential virus. We enforce our own order on the chaos of the internet. That confidence comes from the underlying math.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-lg mt-8">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Interviewer&apos;s Reflection</h2>
                <p className="text-gray-300">The shift from boat to factory reframes everything: from product anxiety to infrastructure confidence. Centralizing logic in a &quot;wizard&quot; for AI resolvability, and treating Ethereum as a settlement membrane rather than the source of truth, turns conventional architecture on its head. Session 3 will go into the physics—Zeroth Theory and the digital organism.</p>
              </div>
            </div>
          </motion.div>
        </div>
        </section>
      </div>
    </>
  );
};
