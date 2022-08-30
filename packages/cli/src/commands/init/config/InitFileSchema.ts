import {PackageManager} from "@tsed/cli-core";
import {ArchitectureConvention, PlatformType, ProjectConvention} from "../../../interfaces";
import {FeatureType} from "./FeaturesPrompt";

export const InitFileSchema = {
  type: "object",
  properties: {
    platform: {
      type: "string",
      description: "The project name. By default, the project is the same as the name directory.",
      enum: Object.values(PlatformType),
      default: PlatformType.EXPRESS
    },
    projectName: {
      type: "string",
      maxLength: 100
    },
    tsedVersion: {
      type: "string"
    },
    features: {
      type: "array",
      items: {
        type: "string",
        enum: Object.values(FeatureType)
      }
    },
    architecture: {
      type: "string",
      enum: Object.values(ArchitectureConvention),
      default: ArchitectureConvention.DEFAULT
    },
    convention: {
      type: "string",
      enum: Object.values(ProjectConvention),
      default: ProjectConvention.DEFAULT
    },
    packageManager: {
      type: "string",
      enum: Object.values(PackageManager),
      default: PackageManager.YARN
    }
  },
  required: ["features"],
  additionalProperties: true
};
