import { DeepPartial } from './types';

type MergeableRecord = Record<string, unknown>;

const isMergeableRecord = (value: unknown): value is MergeableRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const deepMerge = <T extends MergeableRecord>(
  target: T,
  source: DeepPartial<T>,
): T => {
  const output: MergeableRecord = { ...target };

  Object.entries(source ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      output[key] = [...value];
      return;
    }

    if (isMergeableRecord(value)) {
      const targetValue = output[key];
      output[key] = deepMerge(
        isMergeableRecord(targetValue) ? targetValue : {},
        value as DeepPartial<MergeableRecord>,
      );
      return;
    }

    output[key] = value;
  });

  return output as T;
};
