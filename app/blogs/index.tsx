import { Redirect } from "expo-router";

export default function LegacyBlogsIndexRedirect(): React.ReactElement {
  return (
    <React.Fragment>
      <Redirect href="/blog" />
    </React.Fragment>
  );
}
