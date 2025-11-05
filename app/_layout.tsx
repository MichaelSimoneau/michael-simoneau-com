import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "../src/providers/AppProviders";

declare global {
  var React: typeof React | undefined;
}

if (typeof globalThis.React === "undefined") {
  globalThis.React = React;
}

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
