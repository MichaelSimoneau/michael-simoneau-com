import React from "react";
import { Redirect } from "expo-router";

export default function LegacyBlogsIndexRedirect() {
  return <Redirect href="/blog" />;
}
