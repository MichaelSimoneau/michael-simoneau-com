// Crypto Fabric specific types
export interface CryptoFabricSection {
  title: string;
  description: string;
  features?: string[];
}

export interface CryptoFabricConfig {
  sections: CryptoFabricSection[];
}

