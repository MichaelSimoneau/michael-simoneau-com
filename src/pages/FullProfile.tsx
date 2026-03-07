import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";

export const FullProfile: React.FC = () => {
  return (
    <>
      <Seo
        title="Michael Simoneau - Full Professional Profile | Enterprise Architect & Technology Leader"
        description="Michael Simoneau's professional profile: 20+ years architecting secure systems for JPMorgan and StoneX. Expert in React Native, AI strategy, and Web3 engineering. Founder of Enigma Key and EtherHive. View full resume and portfolio."
        canonicalUrl="https://www.michaelsimoneau.com/profile"
        keywords={[
          "Michael Simoneau",
          "Full Profile",
          "Resume",
          "CV",
          "Professional Profile",
          "Enterprise Architect",
          "Technology Leader",
          "Software Engineer",
          "Mobile Development",
          "React Native",
          "iOS Development",
          "Android Development",
          "Full Stack",
          "Web3",
          "Blockchain",
          "JPMorgan",
          "StoneX",
          "Enigma Key",
          "Contact Information",
          "Direct Contact",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Michael Simoneau',
            jobTitle: 'Enterprise Architect & Technology Leader',
            description: 'Leader, Inventor & Investor. Innovator & Expert Engineer. Founder @ Enigma Key Co.',
            url: 'https://www.michaelsimoneau.com/profile',
            image: 'https://www.michaelsimoneau.com/profile-image.png',
            email: 'michael.simoneau@brainycouch.com',
            sameAs: [
              'https://github.com/ZerothTheory',
            ],
            alumniOf: [
              {
                '@type': 'EducationalOrganization',
                name: 'University of London',
              },
              {
                '@type': 'EducationalOrganization',
                name: 'Cleveland State University',
              },
            ],
            worksFor: {
              '@type': 'Organization',
              name: 'Enigma Key Industries, LLC',
            },
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
                name: 'Full Profile',
                item: 'https://www.michaelsimoneau.com/profile'
              }
            ]
          }
        ]}
      />
      <AnimatedBackground />
      <MainNav />
      <motion.div
        className="min-h-screen text-white p-8 relative z-10 pt-24 md:pt-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto mt-16">
          {/* Header Section */}
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-center mb-12"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:mr-8 mb-6 md:mb-0 flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
                <img
                  src="/profile-image.png"
                  alt="Michael Simoneau"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl font-bold mb-2 text-cyan-400">
                Michael Simoneau
              </h1>
              <p className="text-2xl text-cyan-300 mb-1">
                Leader, Inventor & Investor
              </p>
              <p className="text-2xl text-cyan-300 mb-1">
                Innovator & Expert Engineer
              </p>
              <p className="text-xl text-gray-400">Founder @ Enigma Key Co.</p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-800/30 p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-cyan-300 mb-2">20+</h3>
              <p className="text-gray-400">Years Experience</p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-cyan-300">Contact</h3>
                  <a
                    href="mailto:michael.simoneau@brainycouch.com"
                    className="text-cyan-400 hover:text-cyan-200 transition-colors"
                  >
                    michael.simoneau@brainycouch.com
                  </a>
                </div>
                <div>
                  <h3 className="text-cyan-300">Email</h3>
                  <a
                    href="mailto:michael.simoneau@brainycouch.com"
                    className="text-cyan-400 hover:text-cyan-200 transition-colors"
                  >
                    michael.simoneau@brainycouch.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Links & Profiles</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-cyan-300">GitHub</h3>
                  <a
                    href="https://github.com/ZerothTheory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-200 transition-colors"
                  >
                    ZerothTheory
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Current Location</h2>
            <p className="text-cyan-300 mb-2">(Okay with Remote)</p>
            <p>
              May 2024 - Current: Hollywood, Los Angeles, California, USA 90038
            </p>
            <p className="mt-4 text-gray-300">
              Michael Simoneau is open to remote work opportunities and has extensive experience working with distributed teams across multiple time zones.
            </p>
          </motion.div>

          {/* Personal Summary */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">PERSONAL SUMMARY</h2>
            <p className="mb-4">
              Michael Simoneau leverages over 20 years of extensive experience in mobile, web,
              and native application development to create user-friendly and
              secure applications that enhance the user experience. Michael Simoneau's expertise
              spans DevOps, Hybrid Mobile, Native Mobile, Full-Stack, and Web3
              engineering. Throughout his career, Michael Simoneau has consistently delivered innovative solutions
              that drive business value and technical excellence.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Technical Skills:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-cyan-300 mb-2">
                      Languages & Platforms:
                    </h4>
                    <p>
                      React-Native, React-Native-Web, Javascript, TypeScript,
                      Node.js, React, Redux, Angular, Ionic, Python, Solidity,
                      Java, Kotlin, Swift, Xcode, UIKit, PHP, HTML5, and MVC,
                      MV**
                    </p>
                  </div>
                  <div>
                    <h4 className="text-cyan-300 mb-2">Deep Expertise:</h4>
                    <p>
                      With a strong command of these technologies, I have led
                      and contributed to numerous successful projects.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Passion for Learning:
                </h3>
                <p>
                  Michael Simoneau is passionate about advancing skills in leadership,
                  business, and engineering. Michael Simoneau continuously seeks to learn new
                  technologies and best practices, always striving to keep
                  learning and teaching. As a lifelong learner and
                  dedicated mentor, Michael Simoneau believes in sharing knowledge and growing together with teams.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Teamwork & Innovation:
                </h3>
                <p>
                  Michael Simoneau thrives in a collaborative environment that values innovation
                  and quality. Working with passionate teams that share these
                  values is one of Michael Simoneau's greatest joys. Michael Simoneau brings a unique perspective
                  to every project, combining technical depth with strategic thinking.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Career Goal:</h3>
                <p>
                  Michael Simoneau's goal is to continue growing as a leader and innovator in
                  the tech industry. Michael Simoneau is excited to take on new challenges and
                  opportunities that allow leveraging skills and
                  experience to create innovative solutions. Michael Simoneau looks forward to contributing
                  to cutting-edge projects that make a meaningful impact.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold">
                  Chief Executive Officer
                </h3>
                <p className="text-cyan-300">Enigma Key Industries, LLC</p>
                <p className="text-gray-400">
                  February 2019 - Present
                </p>
                <p className="text-gray-400">Chesterland, Ohio</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Led the company in all aspects of operations and strategic
                    planning under Michael Simoneau's leadership.
                  </li>
                  <li>
                    Oversaw the development and deployment of mobile and web
                    applications, with Michael Simoneau ensuring quality and innovation.
                  </li>
                  <li>
                    Managed a team of developers and ensured the delivery of
                    high-quality software products that reflect Michael Simoneau's standards.
                  </li>
                  <li>
                    Engaged with clients to understand their needs and provided
                    tailored technology solutions, showcasing Michael Simoneau's client-focused approach.
                  </li>
                  <li>
                    Drove innovation in blockchain and Web3 technologies,
                    empowering the company to stay at the forefront of the
                    industry through Michael Simoneau's vision.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Architect / Senior Lead Software Engineer
                </h3>
                <p className="text-cyan-300">StoneX Group Inc.</p>
                <p className="text-gray-400">
                  September 2022 - February 2024
                </p>
                <p className="text-gray-400">
                  Chicago, Illinois, United States
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Led the development of a cross-platform mobile application
                    using TypeScript and React Native.
                  </li>
                  <li>
                    Architected the system to ensure scalability and
                    maintainability.
                  </li>
                  <li>
                    Coordinated with various stakeholders to integrate new
                    features and improvements.
                  </li>
                  <li>
                    Developed core components and mentored junior developers.
                  </li>
                  <li>
                    Implemented best practices for code quality and performance.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Senior Software Engineer
                </h3>
                <p className="text-cyan-300">OneMain Financial</p>
                <p className="text-gray-400">
                  February 2022 - July 2022
                </p>
                <p className="text-gray-400">Remote</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Designed and developed software solutions to meet business
                    requirements.
                  </li>
                  <li>
                    Ensured high performance and scalability of applications.
                  </li>
                  <li>
                    Collaborated with cross-functional teams to deliver projects
                    on time.
                  </li>
                  <li>
                    Conducted code reviews and implemented automated testing
                    frameworks.
                  </li>
                  <li>
                    Maintained and enhanced existing applications based on user
                    feedback.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Lead iOS Engineer</h3>
                <p className="text-cyan-300">JPMorgan Chase & Co.</p>
                <p className="text-gray-400">
                  October 2019 - January 2022
                </p>
                <p className="text-gray-400">
                  Chicago, Illinois, United States
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Developed the PaymentNet Mobile iOS application using Swift5
                    and XCode.
                  </li>
                  <li>
                    Ensured a seamless user experience through rigorous testing
                    and quality assurance.
                  </li>
                  <li>
                    Integrated secure payment processing features and
                    certificate pinning.
                  </li>
                  <li>
                    Coordinated with design and product teams to align the
                    application with business goals.
                  </li>
                  <li>
                    Provided technical guidance and leadership to the iOS
                    development team.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Mobile Application Developer
                </h3>
                <p className="text-cyan-300">Pulse</p>
                <p className="text-gray-400">
                  October 2018 - February 2019
                </p>
                <p className="text-gray-400">Chesterland, OH</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Replatformed mobile applications using React Native for
                    major clients like Samsung and AT&T.
                  </li>
                  <li>
                    Collaborated with client teams to understand requirements
                    and deliver customized solutions.
                  </li>
                  <li>
                    Ensured the applications met performance and security
                    standards.
                  </li>
                  <li>
                    Implemented features and fixes based on user feedback.
                  </li>
                  <li>
                    Conducted testing and debugging to ensure application
                    stability.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Mobile Application Developer
                </h3>
                <p className="text-cyan-300">Medical Mutual</p>
                <p className="text-gray-400">
                  March 2018 - August 2018
                </p>
                <p className="text-gray-400">Cleveland/Akron, Ohio Area</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Developed hybrid mobile applications using Cordova and
                    Angular.
                  </li>
                  <li>
                    Ensured compliance with HIPAA and corporate security
                    standards.
                  </li>
                  <li>Worked closely with back-end teams to integrate APIs.</li>
                  <li>Conducted performance testing and optimization.</li>
                  <li>
                    Provided support and maintenance for existing applications.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Software Engineer</h3>
                <p className="text-cyan-300">HyperProductive, LLC</p>
                <p className="text-gray-400">
                  February 2016 - January 2017
                </p>
                <p className="text-gray-400">Cleveland/Akron, Ohio Area</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Developed native and hybrid Android applications.</li>
                  <li>
                    Worked on full-stack development using Java and AngularJS.
                  </li>
                  <li>
                    Collaborated with clients to gather requirements and deliver
                    tailored solutions.
                  </li>
                  <li>
                    Implemented custom features and integrations based on client
                    needs.
                  </li>
                  <li>
                    Conducted code reviews and ensured adherence to best
                    practices.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">IT Consultant</h3>
                <p className="text-cyan-300">RageOn!</p>
                <p className="text-gray-400">
                  July 2015 - January 2016
                </p>
                <p className="text-gray-400">Cleveland/Akron, Ohio Area</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Developed full-stack solutions using Ruby on Rails, React,
                    and Shopify Liquid.
                  </li>
                  <li>
                    Worked on customizing and extending e-commerce platforms.
                  </li>
                  <li>
                    Implemented front-end and back-end features based on client
                    requirements.
                  </li>
                  <li>
                    Ensured the performance and scalability of applications.
                  </li>
                  <li>
                    Provided technical support and troubleshooting for deployed
                    applications.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Senior Lead Web Developer
                </h3>
                <p className="text-cyan-300">Rattan Outdoor Furniture</p>
                <p className="text-gray-400">
                  February 2014 - March 2015
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Led the development of the company's website and e-commerce
                    platform.
                  </li>
                  <li>
                    Implemented SEO strategies to improve search engine
                    rankings.
                  </li>
                  <li>
                    Developed custom modules and integrations to enhance
                    functionality.
                  </li>
                  <li>
                    Managed a team of developers and coordinated with other
                    departments.
                  </li>
                  <li>
                    Provided training and support for web-related technologies.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Frontend / Backend Developer
                </h3>
                <p className="text-cyan-300">TapFury</p>
                <p className="text-gray-400">
                  December 2011 - February 2013
                </p>
                <p className="text-gray-400">Greater New York City Area</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Developed front-end and back-end solutions for various
                    projects.
                  </li>
                  <li>
                    Used Zend Framework for PHP MVC and JavaScript for
                    client-side development.
                  </li>
                  <li>Integrated APIs and third-party services.</li>
                  <li>
                    Conducted testing and debugging to ensure application
                    stability.
                  </li>
                  <li>
                    Collaborated with designers and product managers to deliver
                    high-quality software.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Lead Web Developer</h3>
                <p className="text-cyan-300">Sneak Attack Media</p>
                <p className="text-gray-400">
                  July 2011 - December 2011
                </p>
                <p className="text-gray-400">Greater New York City Area</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Created landing pages and small apps for Facebook to promote
                    indie artists.
                  </li>
                  <li>
                    Worked closely with the marketing team to understand
                    promotional needs.
                  </li>
                  <li>Developed interactive features and user interfaces.</li>
                  <li>
                    Ensured the performance and scalability of web applications.
                  </li>
                  <li>
                    Provided technical support and maintenance for deployed
                    applications.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-2xl font-bold mb-8">Top Skills</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-8">Primary Skills</h3>
                <p className="text-cyan-300">
                  TypeScript, JavaScript, Node.js, React, React Native, Swift,
                  Xcode, MV*
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Other Skills</h3>
                <div className="grid grid-cols-1">
                  <p>✓ React Native</p>
                  <p>✓ Native iOS</p>
                  <p>✓ Swift</p>
                  <p>✓ UIKit</p>
                  <p>✓ Certificate Pinning</p>
                  <p>✓ Encryption</p>
                  <p>✓ Hybrid Mobile Apps</p>
                  <p>✓ iOS Target</p>
                  <p>✓ Android Target</p>
                  <p>✓ Custom Cordova Plugins</p>
                  <p>✓ Angular</p>
                  <p>✓ Ionic</p>
                  <p>✓ Ionic Pro</p>
                  <p>✓ SenchaJS</p>
                  <p>✓ Native Android</p>
                  <p>✓ Java 1.8+</p>
                  <p>✓ Custom PDF Viewer</p>
                  <p>✓ Content Providers</p>
                  <p>✓ SAP MBO Client</p>
                  <p>✓ DevOps</p>
                  <p>✓ Version Control</p>
                  <p>✓ Subversion</p>
                  <p>✓ Git</p>
                  <p>✓ Automated Testing</p>
                  <p>✓ E2E Testing</p>
                  <p>✓ Integration Testing</p>
                  <p>✓ Unit Testing</p>
                  <p>✓ Continuous Integration</p>
                  <p>✓ Git Hooks</p>
                  <p>✓ Jenkins</p>
                  <p>✓ GitLab CI</p>
                  <p>✓ Github Enterprise</p>
                  <p>✓ Docker Containers</p>
                  <p>✓ Continuous Deployment</p>
                  <p>✓ Heroku</p>
                  <p>✓ Azure DevOps Pipelines</p>
                  <p>✓ Google Cloud Platform</p>
                  <p>✓ Agile Software Development</p>
                  <p>✓ Scrum Team Leader</p>
                  <p>✓ Scrum Workflow</p>
                  <p>✓ Scrum Ceremonies</p>
                  <p>✓ Azure DevOps</p>
                  <p>✓ Jira</p>
                  <p>✓ Node / NPM</p>
                  <p>✓ Grunt / Gulp</p>
                  <p>✓ HTML / CSS / Native JS</p>
                  <p>✓ HTML5</p>
                  <p>✓ Media / Canvas</p>
                  <p>✓ Image Manipulation</p>
                  <p>✓ SCSS / CSS</p>
                  <p>✓ Transitions and Animations</p>
                  <p>✓ Native JS</p>
                  <p>✓ Fundamentals and OOP</p>
                  <p>✓ No Libraries Needed!</p>
                  <p>✓ jQuery / Prototype</p>
                  <p>✓ TypeScript</p>
                  <p>✓ AngularJS / Angular 2</p>
                  <p>✓ RxJs - Observables</p>
                  <p>✓ Component Architecture</p>
                  <p>✓ React JS</p>
                  <p>✓ Shopify Liquid</p>
                  <p>✓ Full-Stack</p>
                  <p>✓ Unix / Shell / SSH</p>
                  <p>✓ Java</p>
                  <p>✓ Android Native Development</p>
                  <p>✓ Oracle Commerce Platform</p>
                  <p>✓ Ruby</p>
                  <p>✓ Mobile App Back-End</p>
                  <p>✓ Desktop Application</p>
                  <p>✓ Coffee / Slim / Haml / Jade</p>
                  <p>✓ Node / Bower / Bundle / Rake</p>
                  <p>✓ SQL / NoSQL</p>
                  <p>✓ Postgres</p>
                  <p>✓ MySQL</p>
                  <p>✓ SQLite</p>
                  <p>✓ Oracle</p>
                  <p>✓ SQL Server</p>
                  <p>✓ MongoDB</p>
                  <p>✓ PHP</p>
                  <p>✓ Magento</p>
                  <p>✓ Zend Framework</p>
                  <p>✓ Node.JS</p>
                  <p>✓ Mobile App Back-End</p>
                  <p>✓ Full-Stack Web Server</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            className="bg-gray-800/30 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <h2 className="text-2xl font-bold mb-4">Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">University of London</h3>
                <p className="text-cyan-300">
                  Bachelor's degree, Computer Science
                </p>
                <p className="text-gray-400">July 2022 - Present</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Cleveland State University
                </h3>
                <p className="text-cyan-300">N/A, Computer Science</p>
                <p className="text-gray-400">2009 - 2011</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Cleveland State University
                </h3>
                <p className="text-cyan-300">
                  Computer Programming, Specific Applications
                </p>
                <p className="text-gray-400">2009 - 2011</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
