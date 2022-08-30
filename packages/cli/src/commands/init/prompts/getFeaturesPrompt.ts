import {cleanObject, isFunction} from "@tsed/core";
import {FeaturesMap, FeaturesPrompt} from "../config/FeaturesPrompt";
import {InitOptions} from "../interfaces/InitOptions";

function mapChoices(item: any, options: Partial<InitOptions>) {
  return item.choices.map((choice: string) => {
    const {checked} = FeaturesMap[choice];

    return cleanObject({
      ...FeaturesMap[choice],
      value: choice,
      checked: isFunction(checked) ? checked(options) : checked
    });
  });
}

export function getFeaturesPrompt(options: Partial<InitOptions>) {
  return FeaturesPrompt().map((item: any) => {
    return cleanObject({
      ...item,
      choices: item.choices?.length ? mapChoices(item, options) : undefined
    });
  });
}
