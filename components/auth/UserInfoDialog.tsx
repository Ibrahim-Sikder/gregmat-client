"use client";
import { useRouter } from "next/navigation";
import React from "react";
import ModalContainer from "../shared/modal/ModalContainer";

interface UserInfoDialogProps {
  children: React.ReactNode;
}

export default function UserInfoDialog({ children }: UserInfoDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <ModalContainer
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) router.back();
      }}
      width="sm"
    >
      {children}
    </ModalContainer>
  );
}
