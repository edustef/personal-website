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

const PAGE_SINGLETONS = ["home", "servicesPage", "resume"];
const NON_PAGE_SINGLETONS = ["settings", "profile"];

const createSingletonListItem = (S: StructureBuilder, schema: any) => {
  const typeName = schema.name as string;
  const title = schema.title as string;
  const icon = schema.icon as any | undefined;

  const listItem = S.listItem()
    .title(title)
    .child(S.document().schemaType(typeName).documentId(typeName));

  return icon ? listItem.icon(icon) : listItem;
};

export const structure: StructureResolver = (S: StructureBuilder) => {
  const nonPageSingletons = singletons.filter(
    (schema: any) => NON_PAGE_SINGLETONS.includes(schema.name),
  );
  const pageSingletons = singletons.filter((schema: any) =>
    PAGE_SINGLETONS.includes(schema.name),
  );

  return S.list()
    .title("Website Content")
    .items([
      ...nonPageSingletons.map((schema: any) =>
        createSingletonListItem(S, schema),
      ),
      S.divider(),
      ...pageSingletons.map((schema: any) =>
        createSingletonListItem(S, schema),
      ),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string));
        }),
    ]);
};
