import { Redirect, useLocalSearchParams } from "expo-router";

export default function LegacyBlogsRedirect(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const href = normalizedId ? `/blog/${normalizedId}` : "/blog";

  return (
    <React.Fragment>
      <Redirect href={href} />
    </React.Fragment>
  );
}
