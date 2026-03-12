import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";
import { PlaylistAudioPlayer } from "../ui/players/PlaylistAudioPlayer";
import { melindaFrancisPlaylist } from "../data/playlists";
import { MARCH_17_2026_9_00_AM } from "src/hooks/useBeforeAndAfter";

export const DrMelindaFrancis: React.FC = () => {
  const [now, setNow] = React.useState(new Date().getTime());
  const [isFired, setIsFired] = React.useState(false);
  const isBeforeFired = React.useMemo(
    () => now < MARCH_17_2026_9_00_AM.getTime(),
    [now],
  );
  const timeLeftToScheduleMs = React.useMemo(
    () => now - MARCH_17_2026_9_00_AM.getTime(),
    [now],
  );
  React.useEffect(() => {
    if (isFired) return;
    const interval = setInterval(() => {
      setNow(new Date().getTime());
      if (timeLeftToScheduleMs >= 0) {
        setIsFired(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isFired, timeLeftToScheduleMs]);
  const timeLeftToScheduleDays = React.useMemo(
    () => Math.abs(Math.floor(timeLeftToScheduleMs / (1000 * 60 * 60 * 24))),
    [timeLeftToScheduleMs],
  );
  const timeLeftToScheduleHours = React.useMemo(
    () =>
      Math.abs(
        Math.floor(
          (timeLeftToScheduleMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
      ),
    [timeLeftToScheduleMs],
  );
  const timeLeftToScheduleMinutes = React.useMemo(
    () =>
      Math.abs(
        Math.floor((timeLeftToScheduleMs % (1000 * 60 * 60)) / (1000 * 60)),
      ),
    [timeLeftToScheduleMs],
  );
  const timeLeftToScheduleSeconds = React.useMemo(
    () => Math.abs(Math.floor((timeLeftToScheduleMs % (1000 * 60)) / 1000)),
    [timeLeftToScheduleMs],
  );
  const timeLeftToSchedule = React.useMemo(
    () =>
      `${timeLeftToScheduleDays ? timeLeftToScheduleDays + ` day${timeLeftToScheduleDays > 1 ? "s" : ""}, ` : ""}` +
      `${timeLeftToScheduleHours ? timeLeftToScheduleHours + ` hour${timeLeftToScheduleHours > 1 ? "s" : ""}, ` : ""}` +
      `${timeLeftToScheduleMinutes ? timeLeftToScheduleMinutes + ` minute${timeLeftToScheduleMinutes > 1 ? "s" : ""}, ` : ""}` +
      `${timeLeftToScheduleSeconds ? timeLeftToScheduleSeconds + ` second${timeLeftToScheduleSeconds > 1 ? "s" : ""}` : ""}`
        .trim()
        .replace(/, $/, ""),
    [
      timeLeftToScheduleDays,
      timeLeftToScheduleHours,
      timeLeftToScheduleMinutes,
      timeLeftToScheduleSeconds,
    ],
  );
  return (
    <>
      <Seo
        title="Dr. Melinda Francis, DSM"
        description="Doctorate of Applied Sciences in Human Psychology / Pioneer in the field of The Psychology of Artificial Intelligence."
        canonicalUrl="https://Dr.MelindaFrancis.com"
        keywords={[
          "Dr. Melinda Francis",
          "Doctorate of Applied Sciences in Human Psychology",
          "Pioneer in the field of The Psychology of Artificial Intelligence",
          "Michael Simoneau",
          "The Soon-To-Be Dr. Melinda Francis, LISW",
          "Zero Sudoku",
          "The Zeroth Theory of Digital Organisms",
          "Tuesday Morning Brief - Good Morning Melinda",
          "Rewriting Einstein to buy your milk",
          "The Zeroth Law of Thermodynamics is Wrong!",
        ]}
        image="https://Dr.MelindaFrancis.com/melinda-francis-profile.png"
      />
      <AnimatedBackground />
      <MainNav />
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
        <section
          id="dr-melinda-francis-hero"
          className="min-h-screen flex flex-col items-center justify-start text-white px-4 pt-16 pb-24 relative overflow-hidden z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              Dr. Melinda Francis, DSM
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-4">
              <strong>
                Doctor of Human Psychology / Clinical Psychologist
              </strong>
              <br />
              Pioneer in the field of{" "}
              <u>The Psychology of Artificial Intelligence</u>
            </p>
            <motion.div
              className="w-full max-w-2xl mx-auto z-10 mt-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6 text-justify">
                <h2 className="text-xl font-bold text-amber-400 mb-3 text-center">
                  {isBeforeFired ? (
                    <span>
                      You have <strong>{timeLeftToSchedule}</strong> left to
                      schedule an appointment for{" "}
                      <strong>March 19th, 2026</strong>.
                    </span>
                  ) : (
                    <span>
                      You have been fired from your position as Ms. Melinda
                      Francis.
                    </span>
                  )}
                </h2>
                {isBeforeFired && (
                  <p className="text-sm text-slate-500 text-center mt-0 mb-3">
                    * Remember, weekends don't count! *
                  </p>
                )}
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  I, <strong>Michael Simoneau</strong> [who still remembers my
                  name], made a curated playlist to try to explain everything
                  over the past 4 weeks. The idea is to show you that I&apos;m
                  OKAY, despite not being your version of{" "}
                  <strong>stable</strong> I am{" "}
                  <strong>
                    <u>managing well</u>
                  </strong>
                  , and this is the goal. Management. I&apos;m more than Okay,
                  I&apos;m developing something that is going to change the
                  world. I am NOT delusional, I used to call you &quot;
                  <strong>The Soon-To-Be Dr. Melinda Francis, LISW</strong>
                  &quot; and even believed it to be true; so much so that I
                  built a website for you:{" "}
                  <a
                    href="https://dr.melindafrancis.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Dr.MelindaFrancis.com
                  </a>
                </p>
                <p className="text-sm text-slate-500 text-center mt-0 mb-3">
                  * See, I took{" "}
                  <a
                    href="https://melindafrancis.com"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    MelindaFrancis.com
                  </a>{" "}
                  down, technically. *
                </p>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  I honestly believe you are suffering from social delusion, and
                  you are projecting your delusion onto me. You deem me to be{" "}
                  <strong>insane</strong> because I won&apos;t agree to buy into
                  the social delusion. But I <strong>am</strong> sane because I
                  can take care of myself and the executive function I lacked I
                  now have{" "}
                  <strong>
                    <u>Linear Algebra</u>
                  </strong>{" "}
                  to solve it. I coded it into an AI.. and website{" "}
                  <a
                    href="https://zerosudoku.com"
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    ZeroSudoku.com
                  </a>
                  .
                  <blockquote className="font-bold mt-4 text-center italic">
                    Math is rules. Physics is rules. Society is a suggestion!
                  </blockquote>
                  <br />
                  <blockquote className="text-center">
                    <strong>"I Am Right; I Am NOT Infallible"</strong> - Michael
                    Simoneau
                  </blockquote>
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full max-w-2xl mx-auto z-10 mb-10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <PlaylistAudioPlayer tracks={melindaFrancisPlaylist} />
          </motion.div>
        </section>
      </div>
    </>
  );
};
