import { motion } from "framer-motion";

export default function Cursor({
  position,
}: {
  position: { left: number; width: number; opacity: number };
}) {
  return (
    <motion.div
      animate={{ ...position }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute z-0 h-9 rounded-lg bg-primary shadow-sm"
    />
  );
}
