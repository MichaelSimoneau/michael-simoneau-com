import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      sphereGeometry: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
      line: any;
      lineBasicMaterial: any;
      color: any;
    }
  }
}
