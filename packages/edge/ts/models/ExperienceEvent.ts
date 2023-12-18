type ExperienceEventArguments =
  | {
      xdmData: Record<string, any>;
      data?: Record<string, any> | null;
      datasetIdentifier?: string | null;
    }
  | {
      xdmData: Record<string, any>;
      data?: Record<string, any> | null;
      datastreamIdOverride?: string | null;
      datastreamConfigOverride?: Record<string, any> | null;
    };

class ExperienceEvent {
  xdmData: Record<string, any>;
  data?: Record<string, any>;
  datasetIdentifier?: string;
  datastreamIdOverride?: string;
  datastreamConfigOverride?: Record<string, any>;

  constructor(args: ExperienceEventArguments);
  // preserve backwards compatibility with the old constructor
  // ExperienceEvent(xdmData, data, datasetIdentifier);
  constructor(xdmData: Record<string, any>, data?: Record<string, any> | null, datasetIdentifier?: string | null);
  // setup the constructor to handle datastreamIdOverride and datastreamConfigOverride
  // ExperienceEvent(xdmData: xdmData, data:data, datasetIdentifier:datasetIdentifier);
  // ExperienceEvent(xdmData: xdmData, data:data, datastreamIdOverride:datastreamIdOverride);
  // ExperienceEvent(xdmData: xdmData, data:data, datastreamConfigOverride:datastreamConfigOverride);
  constructor(
    argsOrXdmData: ExperienceEventArguments | Record<string, any>,
    data?: Record<string, any> | null,
    datasetIdentifier?: string | null,
  ) {
    if (typeof argsOrXdmData === 'object' && 'xdmData' in argsOrXdmData) {
      const args = argsOrXdmData as ExperienceEventArguments;
      this.xdmData = args.xdmData;
      this.data = args.data;
      this.datasetIdentifier = 'datasetIdentifier' in args ? args.datasetIdentifier : undefined;
      this.datastreamIdOverride = 'datastreamIdOverride' in args ? args.datastreamIdOverride: undefined;
      this.datastreamConfigOverride = 'datastreamConfigOverride' in args ? args.datastreamConfigOverride : undefined;
    } else {
      this.xdmData = argsOrXdmData as Record<string, any>;
      this.data = data;
      this.datasetIdentifier = datasetIdentifier;
    }
  }
}
export default ExperienceEvent;
  