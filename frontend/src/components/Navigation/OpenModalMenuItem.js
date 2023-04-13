import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  // component to render inside the modal
  modalComponent,
  // text of the menu item that opens the modal
  itemText,
  // optional: callback function that will be called once the menu item
  // that opens the modal is clicked
  onItemClick,
  // optional: callback function that will be called once the modal is closed
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);

    setModalContent(modalComponent);

    if (onItemClick) onItemClick();
  };

  return <p onClick={onClick}>{itemText}</p>;
}

export default OpenModalMenuItem;
