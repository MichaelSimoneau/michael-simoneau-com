import React from "react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "../backgrounds/AnimatedBackground";
import { MainNav } from "../layout/MainNav";
import { PlaylistAudioPlayer } from "../ui/players/PlaylistAudioPlayer";
import { melindaFrancisPlaylist } from "../data/playlists";
import { MARCH_17_2026_10_00_AM } from "src/hooks/useBeforeAndAfter";
import { AudioPlayer } from "src/ui/players/AudioPlayer";
import { AmaEmbedded } from "../features/ama/components";
import { parseInlineMarkdown } from "../utils/markdown";

type MelindaContentBlock =
  | { type: "heading"; level: 1 | 2; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

const parseMelindaMarkdown = (markdown: string): MelindaContentBlock[] => {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const sections = normalized
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.flatMap((section): MelindaContentBlock[] => {
    const lines = section.split("\n").map((line) => line.trimEnd());
    const nonEmptyLines = lines.filter(Boolean);
    if (!nonEmptyLines.length) {
      return [];
    }

    if (nonEmptyLines[0].startsWith("# ")) {
      return [
        {
          type: "heading",
          level: 1,
          content: nonEmptyLines[0].replace(/^#\s+/, "").trim(),
        },
      ];
    }

    if (nonEmptyLines[0].startsWith("## ")) {
      return [
        {
          type: "heading",
          level: 2,
          content: nonEmptyLines[0].replace(/^##\s+/, "").trim(),
        },
      ];
    }

    const isUnorderedList = nonEmptyLines.every((line) => /^\*\s+/.test(line));
    if (isUnorderedList) {
      return [
        {
          type: "list",
          items: nonEmptyLines.map((line) => line.replace(/^\*\s+/, "").trim()),
        },
      ];
    }

    return [
      {
        type: "paragraph",
        content: nonEmptyLines.join("\n").trim(),
      },
    ];
  });
};

const toInlineHtml = (text: string): string =>
  parseInlineMarkdown(text).replace(/\n/g, "<br />");

export const MelindaFrancis: React.FC = () => {
  const [now, setNow] = React.useState(new Date().getTime());
  const [contentBlocks, setContentBlocks] = React.useState<
    MelindaContentBlock[]
  >([]);
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
  React.useEffect(() => {
    let isMounted = true;

    const loadMarkdown = async () => {
      try {
        const response = await fetch("/melinda.md");
        if (!response.ok) {
          throw new Error(`Failed to load melinda.md: ${response.status}`);
        }
        const markdown = await response.text();
        if (isMounted) {
          setContentBlocks(parseMelindaMarkdown(markdown));
        }
      } catch (error) {
        console.error("Unable to load melinda.md", error);
        if (isMounted) {
          setContentBlocks([]);
        }
      }
    };

    void loadMarkdown();
    return () => {
      isMounted = false;
    };
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
                <hr className="mt-8 mb-2 border-t border-cyan-900/60 w-[72%] mx-auto" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="flex justify-center mb-6">
                    <AudioPlayer
                      title="Google's Latest AI Analyzed Michael Simoneau's Behavior"
                      src="/audio/2026-03-15/Michael_Simoneau_s_72_Hour_Clinical_Standoff.mp3"
                    />
                  </div>
                </motion.div>
                <hr className="mt-2 mb-6 border-t border-cyan-900/60 w-[72%] mx-auto" />
                {contentBlocks.map((block, index) => {
                  const key = `${block.type}-${index.toString()}`;
                  return (
                    <React.Fragment key={key}>
                      {block.type === "heading" ? (
                        block.level === 1 ? (
                          <h2
                            className="text-2xl sm:text-3xl font-bold text-white text-center mb-3"
                            dangerouslySetInnerHTML={{
                              __html: toInlineHtml(block.content),
                            }}
                          />
                        ) : (
                          <p
                            className="text-sm sm:text-base text-cyan-300 text-center font-semibold mb-2"
                            dangerouslySetInnerHTML={{
                              __html: toInlineHtml(block.content),
                            }}
                          />
                        )
                      ) : null}
                      {block.type === "paragraph" &&
                      block.content?.trim() === "---" ? (
                        <hr className="border-t border-[#0b1a3a] my-4" />
                      ) : block.type === "paragraph" ? (
                        <p
                          className="text-base text-gray-300 leading-relaxed mb-3"
                          dangerouslySetInnerHTML={{
                            __html: toInlineHtml(block.content),
                          }}
                        />
                      ) : null}
                      {block.type === "list" ? (
                        <ul className="list-disc list-inside text-base text-gray-300 leading-relaxed mb-3 space-y-1">
                          {block.items.map((item, itemIndex) => (
                            <li
                              key={`${key}-item-${item.slice(0, 24)}-${itemIndex.toString()}`}
                              dangerouslySetInnerHTML={{
                                __html: toInlineHtml(item),
                              }}
                            />
                          ))}
                        </ul>
                      ) : null}
                    </React.Fragment>
                  );
                })}
                <hr className="my-6 border-t border-cyan-900/60 w-[72%] mx-auto" />
                <div className="mb-6">
                  <AmaEmbedded
                    title="Ask About Michael Simoneau"
                    subtitle="Get grounded answers from the public text and audio transcript corpus."
                  />
                </div>
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
