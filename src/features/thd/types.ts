/**
 * THD (The Human Dollar) feature types.
 * Used for section structure and future content configuration.
 */
export interface ThdSection {
  title: string;
  description: string;
  features?: string[];
}

export interface ThdConfig {
  sections: ThdSection[];
}
