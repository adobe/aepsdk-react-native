type ExperienceEventArguments =
    {
      xdmData?: Record<string, any>;
      data?: Record<string, any> | null;
      datasetID?: string | null;
    }
  | {
      xdmData?: Record<string, any>;
      data?: Record<string, any> | null;
      datastreamIdOverrides: string | null;
      datastreamConfigOverride: Record<string, any> | null;
    };

class ExperienceEvent {
  xdmData?: Record<string, any>;
  data?: Record<string, any>;
  datasetID?: string;
  datastreamIdOverrides?: string;
  datastreamConfigOverride?: Record<string, any>;

  constructor(args: ExperienceEventArguments);
  constructor(
    xdmData?: Record<string, any>,
    data?: Record<string, any> | null,
    datasetID?: string | null,
  );
  constructor(
    argsOrXdmData?: ExperienceEventArguments | Record<string, any>,
    data?: Record<string, any> | null,
    datasetID?: string | null,
  ) {
    if (argsOrXdmData && typeof argsOrXdmData === 'object') {
      // Handle case where a single argument object
      const args = argsOrXdmData as ExperienceEventArguments;
      if ('datasetID' in args) {
        // Object contains xdmData, data, and datasetID
        const { xdmData, data, datasetID } = args;
        this.xdmData = xdmData;
        this.data = data;
        this.datasetID = datasetID;
      } else if ('dataStreamIdOverrides' in args && 'datastreamConfigOverride' in args) {
        // Object contains xdmData, data, datastreamIdOverrides, and datastreamConfigOverride
        const { xdmData, data, datastreamIdOverrides, datastreamConfigOverride } = args;
        this.xdmData = xdmData;
        this.data = data;
        this.datastreamIdOverrides = datastreamIdOverrides;
        this.datastreamConfigOverride = datastreamConfigOverride;
      }
    } else {
      // Handle case where separate parameters
      this.xdmData = argsOrXdmData;
      this.data = data;
      this.datasetID = datasetID;
    }
  }
}

export default ExperienceEvent;