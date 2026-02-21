import React from 'react';
import { motion } from 'framer-motion';

const sectionData = [
  {
    heading: 'The Axiom of Zeroth',
    body: 'Scalar zero is a negative identity tensor that acts as a mirror of inverted magnitude',
  },
  {
    heading: 'The Law of Zeroth Theory',
    body: 'The quantity of options implicitly limits the number of total  possible options to exactly the quantity of options given plus one.',
  },
  {
    heading: 'The Assumption of Zeroth Theory',
    body: 'The rule is base 3 because from the human perspective there must be dichotomy. In order to define light there must also be dark. The fact that there is a \u2018here\u2019 and \u2018there\u2019 emphatically implies the existence of the \u201Ceverywhere\u201D. Dictated by the Law of Zeroth Theory, from the human perspective, there are a total of 3 options.',
  },
];

export const ZerothTheorySection: React.FC = () => {
  return (
    <motion.section
      className="w-full bg-white py-16 md:py-24 px-6 md:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-center text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="relative inline-block">
            Zer
            <span className="font-mono slashed-zero">0</span>
            th The
            <span className="font-mono slashed-zero">0</span>
            ry
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gray-400" />
          </span>
        </motion.h2>

        {/* Divider */}
        <hr className="border-t border-gray-300 my-8" />

        {/* Content blocks */}
        {sectionData.map((item, idx) => (
          <motion.div
            key={item.heading}
            className="mb-12 last:mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 * (idx + 1) }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-3">
              {item.heading}
            </h3>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {item.body}
            </p>
          </motion.div>
        ))}

        {/* Byline */}
        <motion.p
          className="text-center text-2xl md:text-3xl font-semibold text-black mt-12"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          by Michael Simoneau
        </motion.p>
      </div>
    </motion.section>
  );
};
