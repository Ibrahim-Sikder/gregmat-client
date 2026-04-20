export default function ClassLayout({
  children,
  classSlot,
}: {
  children: React.ReactNode;
  classSlot: React.ReactNode;
}) {
  return (
    <>
      {classSlot}
      {children}
    </>
  );
}
