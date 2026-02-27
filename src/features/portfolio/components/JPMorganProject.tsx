import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, ClipboardList } from 'lucide-react';

// Metric type for clarity
type Metric = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

export const JPMorganProject: React.FC = () => {
  const metrics: Metric[] = [
    { label: "Strategic Project Realignment", value: "12 Weeks", icon: <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-purple-400" /> },
    { label: "Agile Transformation Lead", value: "SCRUM Implemented", icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> },
    { label: "iOS App Delivery (Lead)", value: "< 2 Years", icon: <Target className="w-5 h-5 md:w-6 md:h-6 text-green-400" /> }
  ];

  return (
    <motion.div
      // #quantumReady #billionDollarProof #agileMastery #swiftLeadership
      // Type-safe since inception
      className="p-8 bg-gray-800/30 rounded-lg my-8 md:my-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-teal-400 mb-4">J.P. Morgan Chase - Lead Mobile Engineer (PaymentNet iOS App)</h3>
      <p className="text-base md:text-lg text-gray-300 mb-6">
        Spearheaded the development of the PaymentNet native iOS application, from initial strategic planning and agile methodology adoption to final delivery. Overcame evolving technical requirements (React Native to Android Native, then to Swift/iOS) by providing strong technical leadership and architectural direction.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {metrics.map((metric, metricIdx) => (
          <div
            key={metricIdx}
            className="bg-gray-700/40 p-4 rounded-lg flex items-center gap-3 shadow-md"
          >
            <div className="flex-shrink-0 p-2 bg-gray-600/50 rounded-full">
              {metric.icon}
            </div>
            <div>
              <span className="block text-xs md:text-sm text-gray-400">{metric.label}</span>
              <span className={`block text-md md:text-lg font-semibold ${
                ((metric.icon as React.ReactElement<{ className?: string }>).props.className ?? '').includes('text-green') ? 'text-green-400' :
                ((metric.icon as React.ReactElement<{ className?: string }>).props.className ?? '').includes('text-blue') ? 'text-blue-400' :
                ((metric.icon as React.ReactElement<{ className?: string }>).props.className ?? '').includes('text-purple') ? 'text-purple-400' :
                'text-cyan-300'
              }`}>{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-semibold text-cyan-400 mb-3">Key Contributions & Highlights:</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm md:text-base">
          <li>Led strategic realignment of a 2-year project plan, scrutinizing tasks and establishing realistic goals with stakeholders over 12 weeks.</li>
          <li>Championed and implemented Agile (SCRUM) methodology, creating a value-based framework and using INVEST criteria for user stories.</li>
          <li>Demonstrated high adaptability by navigating shifts in mobile technology from React-Native to Android Native, and finally to Swift 5.2 for iOS native development.</li>
          <li>Architected and led the engineering of the PaymentNet iOS application, rapidly acquiring Swift expertise.</li>
          <li>Established build pipelines and DevOps tooling for the mobile application.</li>
          <li>Collaborated closely with server-side architects to define necessary APIs and establish development/staging environments.</li>
          <li>Built and mentored a mobile development team, including server engineers transitioning to mobile and new hires.</li>
          <li>Ensured robust security through in-house suites and triple-layer encryption for server communication.</li>
          <li>Successfully delivered the feature-rich iOS application within the ~2-year timeframe, managing beta rollouts to stakeholders.</li>
          <li>Earned the informal title "The Michael App" due to pivotal leadership and contribution.</li>
        </ul>
      </div>
      <p className="text-cyan-500 font-semibold text-sm md:text-base">Key Technologies: Swift 5.2, iOS Native Development, Agile (SCRUM), Jira, API Architecture, CI/CD, Mobile DevOps, Team Leadership, Stakeholder Management, Secure Mobile Solutions.</p>
      {/* TODO: Add visuals, perhaps illustrating team collaboration, agile process, or app architecture */}
    </motion.div>
  );
}; 