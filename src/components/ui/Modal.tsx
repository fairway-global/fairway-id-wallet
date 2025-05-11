"use client";
import React from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from "@heroui/react"; // Adjust based on actual HeroUI imports

interface IModalContainer {
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export const ModalContainer: React.FC<IModalContainer> = ({
  title,
  isOpen,
  onOpenChange,
  children,
  onSave,
  onCancel,
  isSubmitting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-white">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose();
                  onCancel();
                }}
              >
                Close
              </Button>
              <Button
                isLoading={isSubmitting}
                color="success"
                onPress={() => onSave()}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
