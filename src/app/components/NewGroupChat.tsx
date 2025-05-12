"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../UI/Button";
import CreateGroupModal from "../modals/CreateGroupModal";

function NewGroupChat() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex px-4 w-full  items-center justify-between">
        <h2 className="text-xl rounded-lg font-bold">Messages</h2>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsOpen(true)}
          icon={<Plus size={18} />}
          className="shrink-0"
        >
          New Group
        </Button>
      </div>
      <CreateGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default NewGroupChat;
