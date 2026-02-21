import { ScrollProvider } from '../src/contexts/ScrollContext';
import { MainPage } from '../src/pages/MainPage';

export default function Index() {
  return (
    <ScrollProvider>
      <MainPage />
    </ScrollProvider>
  );
}
