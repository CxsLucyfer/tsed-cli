import {InitCmdContext} from "@tsed/cli";
import {Inject, OnExec, ProjectPackageJson, RootRendererService, SrcRendererService} from "@tsed/cli-core";
import {Injectable} from "@tsed/di";
import {TEMPLATE_DIR} from "../utils/templateDir";

@Injectable()
export class TypeGraphqlInitHook {
  @Inject()
  protected packageJson: ProjectPackageJson;

  @Inject()
  protected rootRenderer: RootRendererService;

  @Inject()
  protected srcRenderer: SrcRendererService;

  @OnExec("init")
  onExec(ctx: InitCmdContext) {
    return [
      {
        title: "Generate files",
        task: async () =>
          this.rootRenderer.renderAll(
            [
              "/src/datasources/index.ts",
              "/src/datasources/MyDataSource",
              "/src/resolvers/recipes/Recipe.ts",
              "/src/resolvers/recipes/RecipeNotFoundError.ts",
              "/src/resolvers/recipes/RecipeResolver.ts",
              "/src/resolvers/index.ts"
            ],
            ctx,
            {
              templateDir: `${TEMPLATE_DIR}/init`
            }
          )
      }
    ];
  }
}
