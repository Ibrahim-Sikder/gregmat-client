import { Button } from '@/components/ui/button';
import { Link } from '@radix-ui/react-navigation-menu';

export default function CloseButton({
  href,
  parent = 'inventory',
}: {
  href: string;
  parent?: string;
}) {
  return (
    <Button type="button" size="lg" variant="outline" asChild>
      <Link href={parent === '' ? `/dashboard${href}` : `/dashboard/${parent}${href}`}>Close</Link>
    </Button>
  );
}
