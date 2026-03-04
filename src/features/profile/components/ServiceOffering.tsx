import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Shield, Layers, Smartphone, Cpu, Code } from 'lucide-react'; // Added/Updated icons
import { InteractiveButton } from '../../../ui/buttons/InteractiveButton'; // Import InteractiveButton

export const ServiceOffering: React.FC = () => { // Renamed from SecurityAudit
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const services = [
    {
      icon: <Layers className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />,
      title: "Enterprise Architecture & Modernization",
      description: "Strategic planning and execution for transforming legacy systems into scalable, resilient, and cloud-native architectures. Specializing in microservices, API gateways, and phased modernization roadmaps."
    },
    {
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />,
      title: "Secure Software Development Lifecycle (SSDLC)",
      description: "Integrating comprehensive security practices throughout the development process, from threat modeling and secure code reviews to automated security testing and vulnerability management, ensuring robust and resilient applications."
    },
    {
      icon: <Smartphone className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />,
      title: "Full-Stack & Mobile Application Development",
      description: "Expert development of high-performance web and mobile applications using modern frameworks like React, React Native, Node.js, and native iOS/Android technologies, focusing on user experience and scalability."
    },
    {
      icon: <Cpu className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />,
      title: "Advanced System Design & Optimization",
      description: "Designing and implementing complex, high-availability systems, optimizing for performance, cost-efficiency, and future growth. Leveraging data-driven insights and best practices for system stability."
    },
    {
      icon: <Code className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />,
      title: "Custom Software & Solutions Engineering",
      description: "Tailored software solutions to meet unique business challenges. From specialized internal tools to complex client-facing platforms, focusing on innovative problem-solving and delivering tangible business value."
    }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      id="service-offerings" // Renamed id
      className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-16 md:py-24 relative"
      initial="hidden"
      animate={controls}
      variants={{ 
        visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.5 } }, 
        hidden: { opacity: 0 }
      }}
    >
      <motion.div
        className="container mx-auto px-4"
        variants={{ 
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, 
          hidden: { opacity: 0, y: 30 }
        }}
      >
        <h2 className="font-bold mb-12 md:mb-16 text-center">
          <span className="block text-3xl sm:text-4xl md:text-5xl text-cyan-400">Expertise & Service Offerings by Michael Simoneau</span>
          <span className="block mt-3 text-xl sm:text-2xl md:text-3xl text-gray-300">Driving Innovation & Resilience</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/70 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700/50 flex flex-col h-full"
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" } 
                },
                hidden: { opacity: 0, y: 40 }
              }}
            >
              <div className="mb-4 flex justify-center md:justify-start">{service.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold mt-2 mb-3 text-center md:text-left">{service.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-grow text-center md:text-left">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          variants={{ 
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: services.length * 0.1 + 0.2 } }, 
            hidden: { opacity: 0, scale: 0.9 }
          }}
        >
          <InteractiveButton 
            text="DISCUSS YOUR PROJECT"
            href="mailto:michael.simoneau@brainycouch.com"
            className="mx-auto" 
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}; 