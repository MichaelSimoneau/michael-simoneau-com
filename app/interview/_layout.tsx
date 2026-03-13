import { Link, Stack, usePathname } from 'expo-router';
import { ArrowLeft } from 'lucide-react';
import { MainNav } from '../../src/layout/MainNav';
import { AnimatedBackground } from '../../src/backgrounds/AnimatedBackground';
import { InterviewPartSwitcher } from '../../src/features/interview/components/InterviewPartSwitcher';

type InterviewPart = 1 | 2 | 3;

const getPartFromPathname = (pathname: string): InterviewPart | undefined => {
  if (pathname.startsWith('/interview/1') || pathname === '/interview') return 1;
  if (pathname.startsWith('/interview/2')) return 2;
  if (pathname.startsWith('/interview/3')) return 3;
  return undefined;
};

export default function InterviewLayout() {
  const pathname = usePathname();
  const currentPart = getPartFromPathname(pathname);

  return (
    <>
      <AnimatedBackground />
      <MainNav />
      <div className="h-screen overflow-y-auto overflow-x-hidden overscroll-behavior-x-none scroll-smooth relative z-10">
        <section className="min-h-screen text-white py-20 px-4 pt-24">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center text-cyan-400 mb-8 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>

            <InterviewPartSwitcher activePart={currentPart ?? 1} />

            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 1000,
                animationTypeForReplace: 'pop',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="1" />
              <Stack.Screen name="2" />
              <Stack.Screen name="3" />
            </Stack>
          </div>
        </section>
      </div>
    </>
  );
}
