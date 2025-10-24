import { CogIcon } from "@sanity/icons";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import pluralize from "pluralize-esm";
import { singletons } from "../schemaTypes/singletons";

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const SINGLETON_TYPES = singletons.map((s) => s.name);
const DISABLED_TYPES = ["assist.instruction.context", ...SINGLETON_TYPES];

const createSingletonListItem = (S: StructureBuilder, schema: any) => {
  const typeName = schema.name as string;
  const title = schema.title as string;
  const icon = schema.icon as any | undefined;

  const listItem = S.listItem()
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName));

  return icon ? listItem.icon(icon) : listItem;
};

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title("Website Content")
    .items([
      ...S.documentTypeListItems()
        // Remove the "assist.instruction.context" and "settings" content  from the list of content types
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        // Pluralize the title of each document type.  This is not required but just an option to consider.
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string));
        }),
      // Add singleton entries programmatically
      ...singletons.map((schema: any) => createSingletonListItem(S, schema)),
    ]);
