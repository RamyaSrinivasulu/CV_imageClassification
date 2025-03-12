import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  loadModel: (modelPath: string, labelPath: string) => Promise<string>;
  runInference: (imagePath: string) =>  Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeClassifyImageModule',
);