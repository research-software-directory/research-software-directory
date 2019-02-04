import { render } from "mustache";
import { IResource } from "../interfaces/resource";

export default function resourceToString(
  resource: IResource,
  template: string
) {
  const getString = () => render(template, resource);
  return getString() || "Untitled?";
}
