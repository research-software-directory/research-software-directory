import { IResource } from "../interfaces/resource";

export default function resourceToString(resource: IResource) {
  const getString = () => {
    switch (resource.primaryKey.collection) {
      case "software":
        return resource.brandName;
      case "person":
        return resource.familyNames;
      case "mention":
        return resource.title;
      case "project":
        return resource.title;
      case "organization":
        return resource.name;
      default:
        return resource.primaryKey.id;
    }
  };
  return getString() || "Untitled?";
}
