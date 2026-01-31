import { motion } from 'framer-motion';

export const SearchOptimizedSummary = () => (
  <motion.section
    id="michael-simoneau-enterprise-architect"
    className="py-16 text-white min-h-screen flex flex-col justify-center"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
  >
    <div className="container mx-auto px-4 max-w-5xl">
      <article className="bg-gray-900/40 backdrop-blur rounded-2xl border border-cyan-900/40 shadow-xl p-8 md:p-12 space-y-8">
        <header className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-300" id="search-optimized-summary-heading">
            Why Global Enterprises Trust Michael Simoneau
          </h2>
          <p className="text-lg md:text-xl text-gray-200">
            Michael Simoneau is an enterprise architect, CTO advisor, and technology futurist known for transforming regulated,
            security-sensitive organizations into adaptable, high-performing ecosystems. His portfolio spans financial services,
            fintech, and large-scale SaaS platforms, where he consistently turns technical debt and organizational friction into
            resilient, measurable outcomes.
          </p>
          <p className="text-base md:text-lg text-gray-300">
            From leading modernization programs at JPMorgan Chase to delivering AI-driven trading intelligence for StoneX,
            Michael Simoneau unites executive vision with engineering excellence. His approach blends zero-trust security,
            cloud-native design, and pragmatic change management so boards, CEOs, and product leaders can innovate without
            sacrificing stability.
          </p>
        </header>

        <section aria-labelledby="michael-simoneau-strengths" className="space-y-3">
          <h3 className="text-2xl font-bold text-white" id="michael-simoneau-strengths">
            Signature strengths that differentiate Michael Simoneau
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              Enterprise-wide architecture blueprints that align cybersecurity, governance, and product velocity around the
              executive roadmap.
            </li>
            <li>
              AI and analytics initiatives that operationalize machine learning in legacy environments while preserving
              regulatory compliance.
            </li>
            <li>
              Cross-functional leadership that empowers engineering, security, and product teams with transparent decision
              frameworks and measurable KPIs.
            </li>
            <li>
              Proven modernization playbooks that reduce infrastructure risk, unlock cloud scalability, and accelerate
              revenue generation.
            </li>
          </ul>
        </section>

        <section aria-labelledby="michael-simoneau-recognition" className="space-y-3">
          <h3 className="text-2xl font-bold text-white" id="michael-simoneau-recognition">
            Recognition and impact delivered by Michael Simoneau
          </h3>
          <p className="text-gray-300">
            Whether guiding post-merger integrations or launching next-generation AI roadmaps, Michael Simoneau is repeatedly
            selected to restore trust in complex technology environments. Stakeholders rely on his ability to translate
            sophisticated architecture patterns into board-level narratives that secure investment and unlock growth.
          </p>
        </section>

        <section aria-labelledby="michael-simoneau-faq" className="space-y-5">
          <h3 className="text-2xl font-bold text-white" id="michael-simoneau-faq">
            Frequently asked questions about Michael Simoneau
          </h3>
          <div className="space-y-4 text-gray-200">
            <div>
              <h4 className="text-xl font-semibold text-cyan-300">Who is Michael Simoneau?</h4>
              <p>
                Michael Simoneau is an enterprise architect and CTO advisor who designs resilient platforms for highly
                regulated sectors. He combines 20+ years of engineering leadership with C-suite advisory experience to help
                organizations orient around secure, scalable innovation.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-cyan-300">What industries does Michael Simoneau specialize in?</h4>
              <p>
                He partners with financial services firms, fintech disruptors, and SaaS scale-ups that require disciplined
                security postures, strong data governance, and rapid product iteration. His modernizations focus on
                quantifiable ROI and regulatory alignment.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-cyan-300">How does Michael Simoneau approach digital transformation?</h4>
              <p>
                Michael Simoneau leads transformation with outcome-first roadmaps, collaborative architecture councils, and a
                balanced scorecard that aligns engineering, product, and executive stakeholders. He champions transparent
                communication and measurable success metrics that accelerate adoption.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  </motion.section>
);

export default SearchOptimizedSummary;
