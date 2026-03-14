import { BeforeAndAfterProvider } from "src/hooks/useBeforeAndAfter";
import { MainPage } from "../src/pages/MainPage";

export default function Index() {
  return (
    <BeforeAndAfterProvider>
      <MainPage />
    </BeforeAndAfterProvider>
  );
}
