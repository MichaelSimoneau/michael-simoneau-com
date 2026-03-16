import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";
import { AudioPlayer } from "../ui/players/AudioPlayer";
import { BUILDING_WEB_4_TRANSCRIPT } from "../features/thd/data/buildingWeb4Transcript";

export const CryptoFabric: React.FC = () => {
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  return (
    <>
      <Seo
        title="Crypto Fabric | EtherHive LLC - Profitability-First Automation Platform"
        description="Crypto Fabric, architected by Michael Simoneau and EtherHive LLC, is a profitability-first automation platform. Deploy Ethereum staking, AI-driven trading, and DePIN nodes with zero configuration and 100% solar power."
        canonicalUrl="https://www.michaelsimoneau.com/cryptofabric"
        keywords={[
          "Crypto Fabric",
          "EtherHive",
          "EtherHive LLC",
          "Ethereum staking",
          "crypto automation",
          "profitability-first automation",
          "DePIN",
          "DePIN networks",
          "Pocket Network",
          "Akash Provider",
          "Storj Storage",
          "Saturn CDN",
          "HOPR Privacy",
          "NYM Gateway",
          "Lava RPC",
          "EigenLayer Operator",
          "SSV Distributed Validators",
          "Freqtrade",
          "Hummingbot",
          "MEV-Share",
          "digital asset operations",
          "AI orchestration",
          "crypto revenue generation",
          "solar-powered crypto infrastructure",
          "profit-sharing model",
          "zero configuration crypto",
          "MicroK8s Kubernetes",
          "Google Secret Manager",
        ]}
        image="https://www.michaelsimoneau.com/cryptofabric.jpeg"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Crypto Fabric',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Linux, Kubernetes',
            description: 'Profitability-first automation platform for digital-asset operators. Deploy Ethereum staking, AI-driven trading, and DePIN node workloads (Pocket Network, Akash, Storj, Saturn, HOPR, NYM, Lava RPC) with zero configuration through our AI-driven Control Center. Built by Michael Simoneau; Hosted by EtherHive, LLC with 100% solar-powered infrastructure and a unique profit-sharing model.',
            url: 'https://www.michaelsimoneau.com/cryptofabric',
            image: 'https://www.michaelsimoneau.com/cryptofabric.jpeg',
            publisher: {
              '@type': 'Organization',
              name: 'EtherHive LLC',
              url: 'https://www.michaelsimoneau.com/cryptofabric',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Freemium profit-sharing model - pay nothing upfront, EtherHive earns 10% of profits generated',
            },
            featureList: [
              'Zero Configuration Setup',
              'Ethereum Staking',
              'AI-Driven Trading',
              'DePIN Node Deployment',
              'Profitability Telemetry',
              'Native Mobile Apps',
              'Solar-Powered Infrastructure',
              'Profit-Sharing Model',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.michaelsimoneau.com/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Crypto Fabric',
                item: 'https://www.michaelsimoneau.com/cryptofabric'
              }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EtherHive LLC',
            url: 'https://www.michaelsimoneau.com/cryptofabric',
            logo: 'https://www.michaelsimoneau.com/cryptofabric.jpeg',
            founder: {
              '@type': 'Person',
              name: 'Michael Simoneau'
            },
            foundingDate: '2024',
            description: 'EtherHive LLC develops Crypto Fabric, a profitability-first automation platform for digital asset operations, Ethereum staking, and DePIN infrastructure.',
            slogan: 'Profitability-First Automation Platform'
          }
        ]}
      />
      <AnimatedBackground />
      <MainNav />
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
        <motion.div
          className="min-h-screen text-white p-8 relative z-10 pt-24 md:pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
          {/* Header Section with Logo */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-start mb-12"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:mr-8 mb-6 md:mb-0 flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
                <img
                  src="/crypto-fabric.jpeg"
                  alt="EtherHive LLC Logo"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl font-bold mb-4 text-cyan-400">
                Crypto Fabric
              </h1>
              <p className="text-2xl text-cyan-300 mb-2">
                Profitability-First Automation Platform
              </p>
              <p className="text-xl text-gray-400 mb-4">
                Built by Michael Simoneau; Hosted by EtherHive, LLC
              </p>
              <p className="text-lg text-gray-300 max-w-3xl">
                Crypto Fabric enables anyone to deploy revenue-generating crypto services – 
                Ethereum staking, automated trading, and decentralized infrastructure – with minimal effort. 
                The AI does it all for you.
              </p>
            </div>
          </motion.div>

          {/* Podcast Introduction */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="text-center mb-6">
              <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-4 italic">
                This podcast explores <em>Metabolic Money and the Digital Organism</em> — 
                the journey from EtherHive to The Human Dollar. It details how value lives in the hash, 
                observation is oxygen, and usage is mining. The architecture and its embodiment 
                (The Human Dollar) are introduced in this episode; for more on the philosophy 
                behind it, see <Link to="/zeroth/theory/chapter/1/principal/1" className="text-cyan-400 hover:text-cyan-300 underline">zeroth</Link> and <Link href="/thd" className="text-cyan-400 hover:text-cyan-300 underline">The Human Dollar</Link>.
              </p>
            </div>
            <div className="flex justify-center mb-6">
              <AudioPlayer
                src="/Building_Web_4_With_Money_That_Lives.mp3"
                title="EtherHive: From #CryptoFabric to HashWeb"
              />
            </div>
            {/* Collapsible Transcript */}
            <div className="rounded-xl bg-gray-900/50 border border-cyan-800/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setTranscriptExpanded((e) => !e)}
                className="w-full flex items-center justify-between gap-2 px-6 py-4 text-left text-cyan-400 font-semibold hover:bg-gray-800/50 transition-colors"
                aria-expanded={transcriptExpanded}
              >
                <span>Transcript</span>
                {transcriptExpanded ? (
                  <ChevronUp size={20} className="flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="flex-shrink-0" />
                )}
              </button>
              {transcriptExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-cyan-800/30">
                  <div className="max-h-[60vh] overflow-y-auto text-gray-300 text-sm leading-relaxed space-y-4 pr-2">
                    {BUILDING_WEB_4_TRANSCRIPT.split(/\n\n+/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Core Value Proposition */}
          <motion.section
            className="mb-12 rounded-xl bg-gray-900/50 p-8 border border-cyan-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">
              Core Value Proposition
            </h2>
            <p className="text-xl text-gray-200 mb-4 italic">
              "It pays the bills for you. You don't have to do anything. The AI actually does it all for you."
            </p>
            <p className="text-gray-300">
              The platform's freemium, profit-sharing model means users pay nothing upfront; 
              EtherHive only earns a share of profits generated. This alignment ensures that if users profit, 
              the company profits – creating a win-win ecosystem.
            </p>
          </motion.section>

          {/* Key Features */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              What Makes Crypto Fabric Different
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Single Orchestration Plane
                </h3>
                <p className="text-gray-300">
                  Centralizes onboarding, guardrails, and rollout policies across dozens of profit-seeking 
                  services without bespoke scripting.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Native Mobile Superpowers
                </h3>
                <p className="text-gray-300">
                  Ships white-labeled iOS and Android binaries for both Super Admins and client tenants, 
                  generated straight from Expo profiles.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Profitability Telemetry
                </h3>
                <p className="text-gray-300">
                  Every module reports revenue, spend, and profit indices back to the Control Center, 
                  so new strategies compete on actual margins instead of projections.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Designed for Regulated Teams
                </h3>
                <p className="text-gray-300">
                  Secrets stay in Google Secret Manager, IAM/IAP wrap the hosted dashboard, 
                  and manifests are policy-checked before rollout.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Architecture Overview */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Architecture Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-cyan-800/50">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Control Plane (Cloud)
                </h3>
                <p className="text-gray-300 mb-3">
                  A cloud-based coordination layer that handles:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Web portal / UI</li>
                  <li>Google OAuth authentication</li>
                  <li>Orchestration & configuration</li>
                  <li>Marketplace functionality</li>
                  <li>Reporting & dashboards</li>
                </ul>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-cyan-800/50">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">
                  Data Plane (Edge Compute)
                </h3>
                <p className="text-gray-300 mb-3">
                  A localized deployment (MicroK8s Kubernetes cluster) that runs:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Trading bots</li>
                  <li>Ethereum validator nodes</li>
                  <li>DePIN nodes (Pocket, Akash, Storj, etc.)</li>
                  <li>Other income-producing infrastructure</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Service Modules */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Service Modules
            </h2>
            <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
              <p className="text-gray-300 mb-4">
                Crypto Fabric includes a comprehensive catalog of profitability-focused modules:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-bold text-cyan-300 mb-2">Trading</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Freqtrade</li>
                    <li>Hummingbot</li>
                    <li>MEV-Share</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-cyan-300 mb-2">Staking & Validators</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>EigenLayer Operator</li>
                    <li>SSV Distributed Validators</li>
                    <li>Ethereum Staking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-cyan-300 mb-2">DePIN Networks</h4>
                  <ul className="list-disc list-inside text-gray-400 space-y-1">
                    <li>Pocket Network</li>
                    <li>Akash Provider</li>
                    <li>Storj Storage</li>
                    <li>Saturn CDN</li>
                    <li>HOPR Privacy</li>
                    <li>NYM Gateway</li>
                    <li>Lava RPC</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Business Model */}
          <motion.section
            className="mb-12 rounded-xl bg-gray-900/50 p-8 border border-cyan-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">
              Unique Business Model
            </h2>
            <p className="text-gray-300 mb-4">
              Unlike traditional businesses that rely on selling products or subscriptions, CryptoFabric:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Generates revenue <strong>without traditional customers</strong></li>
              <li>Uses AI-driven modules to actively earn crypto (trading, staking, DePIN)</li>
              <li>Takes a <strong>10% profit share only when users are profitable</strong></li>
              <li>Can generate revenue even if never "sold" in the conventional sense</li>
            </ul>
            <p className="text-gray-300">
              Every deployment is a self-sustaining profit center. The platform's profit-sharing model 
              aligns incentives: EtherHive only succeeds when users succeed.
            </p>
          </motion.section>

          {/* Sustainability */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Sustainable & Cost-Efficient Infrastructure
            </h2>
            <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
              <p className="text-gray-300 mb-4">
                The initial infrastructure is <strong>100% solar-powered</strong> and on-premises, 
                dramatically lowering operating costs and carbon footprint.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-cyan-300">Initial Investment</h3>
                  <p className="text-gray-300">
                    ~$3,000 one-time hardware investment (servers, solar setup, batteries) 
                    plus ~$300/month in connectivity and maintenance.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-cyan-300">Cost Advantage</h3>
                  <p className="text-gray-300">
                    This setup replaces cloud workloads that would otherwise cost thousands per month, 
                    resulting in high gross margins and ESG-positive narrative.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Compliance & Security */}
          <motion.section
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Compliance & Security Focus
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">Regulated Execution</h3>
                <p className="text-gray-300">
                  All trading is executed through regulated exchanges (Coinbase), ensuring compliance 
                  with U.S. regulations. Staking and node operations earn native protocol rewards, 
                  aligning with existing regulatory expectations.
                </p>
              </div>
              <div className="rounded-lg bg-gray-900/50 p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3 text-cyan-300">Non-Custodial Design</h3>
                <p className="text-gray-300">
                  EtherHive does not custody user funds; users keep assets in their own Coinbase 
                  accounts or wallets. Strong security foundation includes encrypted key storage, 
                  firewalls, Kubernetes sandboxing, and AI-based anomaly detection.
                </p>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="rounded-xl bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-8 border border-cyan-800/50">
              <h2 className="text-3xl font-bold mb-4 text-cyan-400">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Learn more about Crypto Fabric's progress and architecture in our blog posts.
              </p>
              <a
                href="/blog"
                className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors"
              >
                View Blog Posts
              </a>
            </div>
          </motion.section>
          </div>
        </motion.div>
      </div>
    </>
  );
};

