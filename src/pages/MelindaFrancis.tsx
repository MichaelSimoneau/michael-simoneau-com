import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { Seo } from "../foundation/seo/Seo";
import { PlaylistAudioPlayer } from "../ui/players/PlaylistAudioPlayer";
import { melindaFrancisPlaylist } from "../data/playlists";
import { MARCH_17_2026_10_00_AM } from "src/hooks/useBeforeAndAfter";
import { AudioPlayer } from "src/ui/players/AudioPlayer";

export const MelindaFrancis: React.FC = () => {
  const [now, setNow] = React.useState(new Date().getTime());
  const timeLeftToScheduleMs = React.useMemo(
    () => now - MARCH_17_2026_10_00_AM.getTime(),
    [now],
  );
  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
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
    () =>
      Math.abs(
        Math.floor(
          (timeLeftToScheduleMs % (1000 * 60 * 60)) / ((1000 * 60) / 60),
        ),
      ),
    [timeLeftToScheduleMs],
  );
  const timeLeftToSchedule = React.useMemo(
    () => {
      // Calculate decimal minutes as 1/10 of 60 seconds (i.e., ranges from .0 to .9).
      const minutes = Math.floor((timeLeftToScheduleSeconds % 60) / 6);
      return (
        `${timeLeftToScheduleDays ? timeLeftToScheduleDays + ` day${timeLeftToScheduleDays > 1 ? "s" : ""}, ` : ""}` +
        `${timeLeftToScheduleHours ? timeLeftToScheduleHours + ` hour${timeLeftToScheduleHours > 1 ? "s" : ""}, ` : ""}` +
        `${timeLeftToScheduleMinutes ? timeLeftToScheduleMinutes - 1 : ""}` +
        `${minutes ? `.${minutes}` : ""} ` +
        ` minute${timeLeftToScheduleMinutes > 1 ? "s" : ""}`
          .trim()
          .replace(/, $/, "")
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      timeLeftToScheduleMs,
      timeLeftToScheduleDays,
      timeLeftToScheduleHours,
      timeLeftToScheduleMinutes,
      timeLeftToScheduleSeconds,
    ],
  );
  return (
    <>
      <Seo
        title="Melinda Francis"
        description="Confused Licensed Independent Social Worker"
        canonicalUrl="https://www.michaelsimoneau.com/melinda"
        keywords={["Ms. Melinda Francis, LISW"]}
        image="https://www.michaelsimoneau.com/profile-image.png"
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
              Ms. Melinda Francis, LISW
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-cyan-400 font-semibold mb-4">
              <strong>Confused Licensed Independent Social Worker</strong>
              <br />
              Abandoning Opportunities to Be a Better Person
            </p>
            <motion.div
              className="w-full max-w-2xl mx-auto z-10 mt-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gray-900/60 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6">
                <h2 className="text-lg font-bold text-amber-400 mb-3 text-center">
                  <div className="text-center mb-2">
                    You have <strong>{timeLeftToSchedule}</strong>
                  </div>
                  <div className="text-center m-auto">
                    left to schedule an appointment for
                  </div>
                  <div className="text-center mt-2 mb-4">
                    <strong>
                      <u>March 19th, 2026</u>
                    </strong>
                    .
                  </div>
                </h2>
                <p className="text-sm text-slate-500 text-center mt-0 mb-3">
                  * Remember, weekends don't count! *
                </p>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <div className="text-left font-bold mx-4 mb-4 pl-8">
                  <strong>Dear Ms. Melinda Francis, LISW,</strong>
                </div>
                <div className="mx-auto max-w-2xl">
                  <p className="text-base text-gray-300 leading-relaxed mb-3">
                    I, <strong>Michael Simoneau</strong>, am{" "}
                    <strong>not delusional</strong>.
                    <br />I used to call you &quot;
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
                    <br />
                    <span className="text-slate-500">
                      {" "}
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
                    </span>
                  </p>
                </div>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <p className="text-base text-gray-300 leading-relaxed mb-3">
                  I honestly believe you are suffering from social delusion,
                  <br />
                  and you are projecting your delusion onto me.
                </p>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <p className="text-base text-gray-300 leading-relaxed mb-3">
                  You deem me to be <strong>insane</strong> because
                  <br />I <strong>will not</strong> agree to buy into the social
                  delusion.
                </p>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <div className="flex justify-center mb-6">
                  <AudioPlayer
                    src="/audio/2026-03-14/Why_Michael_Simoneau_Invented_the_Human_Dollar.mp3"
                    title="Why Michael Simoneau is Objectively Sane... and Why You Are Not"
                  />
                </div>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <p className="text-base text-gray-300 leading-relaxed mb-3">
                  But I <strong>am sane</strong> because I can take care of{" "}
                  <strong>myself</strong>;<br />I sustain the executive function
                  to care for <strong>myself</strong>.
                </p>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <p className="text-base text-gray-300 leading-relaxed mb-3">
                  The executive function I lacked I now have{" "}
                  <strong>
                    <u>Linear Algebra</u>
                  </strong>{" "}
                  to solve it.
                  <br />I coded it into an AI.. and website{" "}
                  <a
                    href="https://zerosudoku.com"
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    ZeroSudoku.com
                  </a>
                  .
                </p>
                <hr className="border-t border-[#0b1a3a] my-4" />
                <blockquote className="font-bold mt-4 text-center italic">
                  Math is rules. Physics is rules. Society is a suggestion!
                  <br />
                  <span className="text-slate-500">
                    * I Fixed Math to Fix Physics to Fix Society *
                  </span>
                </blockquote>
                <br />
                <blockquote className="text-center">
                  &quot;I <strong>Move Fast</strong> and <strong>Break Shit</strong>;{" "}
                  I <strong>Learn</strong> From <strong>My Mistakes</strong> and
                  <strong> I Fix</strong> Them <strong><i>Quickly</i></strong>!&quot;
                  <span className="text-slate-500">
                    <div className="text-center">
                      <strong>
                        "I am <u>right</u>;
                        I am <u>not</u> <u>infallible</u>!"
                      </strong>
                    </div>
                  </span>
                  <br />
                  <div className="text-right mt-8">- Michael Simoneau</div>
                </blockquote>
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
            <PlaylistAudioPlayer
              tracks={melindaFrancisPlaylist}
              defaultPlaylistTitle="Dear Melinda Francis, LISW: Feb. 20, 2026:"
            />
          </motion.div>
        </section>
      </div>
    </>
  );
};
