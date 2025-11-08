import React from "react";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function LegacyBlogsRedirect() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const href = normalizedId ? `/blog/${normalizedId}` : "/blog";

  return <Redirect href={href} />;
}
