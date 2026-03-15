import React from "react";
import { AmaPanel } from "./AmaPanel";

interface AmaEmbeddedProps {
  title?: string;
  subtitle?: string;
}

export const AmaEmbedded: React.FC<AmaEmbeddedProps> = ({
  title = "Ask Me Anything",
  subtitle = "Ask direct questions and get corpus-grounded answers.",
}) => {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-cyan-500/30 bg-gray-950/50 p-4 sm:p-6">
      <h3 className="text-2xl font-bold text-cyan-300">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{subtitle}</p>
      <AmaPanel mode="embedded" className="mt-4" />
    </div>
  );
};
