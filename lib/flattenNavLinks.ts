export function flattenNavLinks(navLinks: any[]) {
  return navLinks.flatMap((cat) =>
    cat.children.map((child: any) => ({
      category: cat.categoryname,
      title: child.subCategoryname,
      subtitle: child.subTitle,
      href: child.href,
      iconName: child.iconName,
    })),
  );
}
