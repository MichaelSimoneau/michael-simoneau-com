import { Redirect } from "expo-router";

export default function LegacyZeroWhyRedirect(): React.ReactElement {
  return (
    <React.Fragment>
      <Redirect href="/blog/zero" />
    </React.Fragment>
  );
}
