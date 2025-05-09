"use client";
import React, { useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/react"; // Adjust based on actual HeroUI imports

interface IModalContainer {
  title: string;
  isOpen: boolean;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

export const ModalContainer: React.FC<IModalContainer> = ({
  title,
  isOpen,
  children,
  onSave,
  onCancel,
}) => {
  const [stayOpen, setStayOpen] = useState(isOpen);

  return (
    <Modal isOpen={stayOpen}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          variant="light"
          onPress={() => {
            setStayOpen(false);
            onCancel();
          }}
        >
          Close
        </Button>
        <Button color="primary" onPress={() => onSave()}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};
