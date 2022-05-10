import {Module, OnAdd, ProjectPackageJson} from "@tsed/cli-core";
import {Inject} from "@tsed/di";
import {TypeGraphqlInitHook} from "./hooks/TypeGraphqlInitHook";

@Module({
  imports: [TypeGraphqlInitHook]
})
export class TypeGraphqlModule {
  @Inject()
  packageJson: ProjectPackageJson;

  @OnAdd("@tsed/cli-plugin-typegraphql")
  install() {
    this.packageJson.addDependencies({
      "@tsed/graphql": "{{tsedVersion}}",
      "apollo-datasource": "^3.3.1",
      "apollo-datasource-rest": "^3.5.1",
      "apollo-server-core": "^3.6.2",
      "type-graphql": "^1.1.1",
      "class-validator": "^0.13.2",
      graphql: "^15.7.2"
    });
    this.packageJson.addDevDependencies({
      "@types/validator": "latest",
      "apollo-server-testing": "latest"
    });
  }
}
