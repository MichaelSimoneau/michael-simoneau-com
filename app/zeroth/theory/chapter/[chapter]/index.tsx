import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ZerothTheoryChapterIndexRoute() {
  const params = useLocalSearchParams();
  const chapterRaw = params.chapter;
  const chapterParam = Array.isArray(chapterRaw) ? chapterRaw[0] : chapterRaw;
  const chapter = chapterParam ?? '1';
  return <Redirect href={`/zeroth/theory/chapter/${chapter}/principal/1`} />;
}
