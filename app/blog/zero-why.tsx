import React from "react";
import { Redirect } from "expo-router";

export default function LegacyZeroWhyRedirect() {
  return <Redirect href="/blog/zero" />;
}
