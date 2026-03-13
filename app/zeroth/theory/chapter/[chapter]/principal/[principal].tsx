import { useLocalSearchParams } from 'expo-router';
import { ZeroTruth } from '../../../../../../src/features/zero-truth/components/ZeroTruth';

export default function ZerothTheoryPrincipleRoute() {
  const params = useLocalSearchParams();
  const chapterRaw = params.chapter;
  const principalRaw = params.principal;
  const chapterParam = Array.isArray(chapterRaw) ? chapterRaw[0] : chapterRaw;
  const principalParam = Array.isArray(principalRaw) ? principalRaw[0] : principalRaw;

  return <ZeroTruth chapterParam={chapterParam} principalParam={principalParam} />;
}
