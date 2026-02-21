import React from 'react';
import { NebulaStormBackground } from './NebulaStormBackground';

interface Props {
  className?: string;
}

export const NebulaBackgroundWithFallback: React.FC<Props> = ({ className }) => (
  <NebulaStormBackground className={className} />
);
