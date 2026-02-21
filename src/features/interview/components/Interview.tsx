import React from 'react';
import { motion } from 'framer-motion';
import { MainNav } from '../../../layout/MainNav';
import { Seo } from '../../../foundation/seo/Seo';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'expo-router';
import { AnimatedBackground } from '../../../backgrounds/AnimatedBackground';

export const Interview: React.FC = () => {
  return (
    <>
      <Seo
        title="An Interview with Michael Simoneau | Technology Leadership Journey"
        description="A deep dive into Michael Simoneau's journey in technology, from building his first computer at age 12 to leading enterprise transformations. Learn about his philosophy on teaching problem-solving, continuous learning, and turning challenges into opportunities."
        canonicalUrl="https://www.michaelsimoneau.com/interview"
        keywords={[
          "Michael Simoneau Interview",
          "Technology Leadership",
          "Problem Solving",
          "Enterprise Architecture",
          "Career Journey",
          "Software Engineering",
          "CTO",
          "Technology Philosophy",
        ]}
        image="https://www.michaelsimoneau.com/profile-image.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'An Interview with Michael Simoneau',
          description: 'A Journey in Technology and Problem-Solving',
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
              href="/" 
              className="inline-flex items-center text-cyan-400 mb-8 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-400">
              <span className="text-cyan-400">Part 1: The Foundation</span>
              <span className="text-gray-600">|</span>
              <Link href="/interview/2" className="hover:text-cyan-400 transition-colors">Part 2: From Code to Architecture</Link>
              <span className="text-gray-600">|</span>
              <Link href="/interview/3" className="hover:text-cyan-400 transition-colors">Part 3: Zeroth & the Digital Organism</Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              <span className="block text-cyan-400">An Interview with Michael Simoneau</span>
              <span className="block text-2xl md:text-3xl mt-4">A Journey in Technology and Problem-Solving</span>
            </h1>

            <div className="space-y-8">
              <div className="bg-gray-900/50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Interview Session 1: The Foundation</h2>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-semibold mb-2">What was your first paid programming job?</p>
                    <p className="text-gray-300">At 16, I secured my first paid programming job building a website for a hairstylist at my local mall. But my journey started much earlier. At 12, I began collecting spare computer parts from friends and family, teaching myself enough to build a "Frankenstein" computer from scratch. This sparked my curiosity about how computers actually worked, leading me to code. With limited resources, I turned to learning JavaScript through the browser console. I was so determined that I printed the entire JavaScript 1.2 Complete Manual at my school library - much to their displeasure - and read it cover to cover.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How did you teach yourself to build computers at age 12?</p>
                    <p className="text-gray-300">My approach was simple but effective - I literally read the manual cover to cover. But the real breakthrough came when I remembered my mother's wisdom: "Necessity is the Mother of all invention." My mother was by far my best influence and catalyst to my success. This led me to realize I needed a concrete project to drive my learning. I decided my first challenge would be to make a clock - it seemed obvious to me because time is money!</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">Tell me about that first clock project.</p>
                    <p className="text-gray-300">My first program was that clock I mentioned - I created a big digital clock display in the center of the screen. I was so committed to perfection that I watched it for hours to ensure it stayed perfectly synchronized. Even then, precision and reliability were non-negotiable for me.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What made you spend hours watching that clock?</p>
                    <p className="text-gray-300">I've always had a detail-oriented nature. Over the years, I learned to channel that focus into determination and tenacity when tackling complex problems.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">When did you first realize this obsessive trait could be a superpower?</p>
                    <p className="text-gray-300">My father played a key role. When I was 16, he insightfully asked me how I planned to turn my passion for code into a career. That prompted me to proactively seek opportunities. I approached numerous businesses at the local mall, offering my skills. It was a valuable lesson in initiative, and eventually, one hairstylist recognized the potential and gave me my first professional project.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What exactly did you say to convince that first client?</p>
                    <p className="text-gray-300">My approach was to first understand her needs. I spent time observing and learning about her business. She was receptive and seemed genuinely interested in how technology could help. So, leveraging my passion for coding, I developed a sample website for her at no initial cost. I then presented it, explaining how it could benefit her business, and offered to take it live. This proactive demonstration of value was key.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What did you learn about her during your research?</p>
                    <p className="text-gray-300">During our initial conversations, my enthusiasm for technology was evident. While the technical details might have been new to her, she was incredibly patient and open-minded. She was a middle-aged Black woman who recognized a young person's passion and gave me a valuable opportunity, an act of faith and support that I deeply respect and that taught me a lot about giving others a chance.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How did this experience with your first client influence how you approach client relationships today?</p>
                    <p className="text-gray-300">That experience was foundational. It reinforced the values of equality and respect my parents instilled in me – values that I believe are crucial in any professional relationship. Her willingness to see potential beyond conventional expectations has significantly shaped how I approach collaborations and build trust with clients today.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">What specific values did your parents instill in you that this experience confirmed?</p>
                    <p className="text-gray-300">My parents, despite their own challenges, consistently emphasized the importance of integrity, hard work, and taking responsibility for one's path. They taught me about balancing acceptance of circumstances with the control one has over their own actions and choices. This experience with my first client reinforced these lessons, particularly how controlling my efforts could lead to opportunities, even when resources were limited.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How did this understanding of acceptance versus control shape your career choices and entrepreneurial journey?</p>
                    <p className="text-gray-300">It directly influenced my career. My parents valued transparency, sharing information openly, which fostered a proactive mindset in me. When faced with the question of earning a living at 16, this principle of informed decision-making led me to actively seek ways to apply my skills, such as printing that JavaScript manual years earlier and then going to the mall to find work.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How has this principle of transparency and informed decision-making evolved in your later career, especially when dealing with complex technical challenges or team leadership?</p>
                    <p className="text-gray-300">This principle has remained central. I believe in learning through direct experience and inquiry, rather than accepting things at face value. It led to a personal practice: I'd metaphorically 'bet' on my assumptions, pushing myself to validate them. If proven wrong, it was a learning opportunity. This mindset was at play even during that first mall visit; I initially doubted anyone would give a young tech enthusiast much time. The hairstylist who listened attentively, even making a client wait, proved my initial assumption wrong and reinforced the value of reaching out and being open to unexpected outcomes. It's a story I shared with my father, highlighting the lesson learned.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How has this principle of challenging assumptions and learning through experience evolved in your technical career, especially when dealing with complex systems or emerging technologies?</p>
                    <p className="text-gray-300">It has solidified my belief that it's more important to teach *how* to learn and problem-solve than *what* to learn in a specific instance. Equipping people with strong critical thinking skills and effective problem-solving methodologies gives them the ability to tackle any challenge they encounter, especially with complex systems and ever-evolving technologies.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">How has this philosophy of teaching "how to learn" influenced your approach to mentoring and team development in your career?</p>
                    <p className="text-gray-300">This philosophy is fundamental to my approach to mentoring and team development. I focus on fostering an environment where continuous learning, critical thinking, and proactive problem-solving are core values. I believe this empowers teams to innovate and tackle even the most advanced technological challenges effectively.</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold mb-2">Can you share a specific example of how this approach to learning and challenging assumptions led to a breakthrough discovery in your work with advanced technologies?</p>
                    <p className="text-gray-300">While I'm not able to discuss specific proprietary breakthroughs at this moment, this approach of continuous learning and challenging assumptions is integral to how I work with advanced technologies. It's about a methodical process of exploration and validation. Thank you for your time; I've enjoyed our conversation and look forward to future discussions.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-6 rounded-lg mt-8">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Interviewer's Reflection</h2>
                <p className="text-gray-300">Your journey from building a "Frankenstein" computer at 12 to mastering advanced technologies is nothing short of remarkable. What struck me most was how your parents' wisdom about transparency and your own obsessive nature evolved into a powerful methodology for learning and innovation. The $20 bet system you developed is a brilliant example of how you turned self-doubt into a tool for growth. Your commitment to teaching "how to learn" rather than "what to learn" reveals a deep understanding of education's true purpose. While you've chosen to keep your latest technological breakthroughs private for now, the foundation you've built through this interview - combining technical expertise with profound insights about learning, transparency, and human potential - suggests that these future revelations will be worth waiting for. Your story is a testament to how personal challenges, when approached with the right mindset, can become the foundation for extraordinary achievements.</p>
              </div>
            </div>
          </motion.div>
        </div>
        </section>
      </div>
    </>
  );
}; 