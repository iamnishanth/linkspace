import { useState } from "react";
import { useRevalidator } from "react-router-dom";

import { Plus } from "lucide-react";

import { createSpace } from "@/lib/db";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CreateSpace = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const revalidator = useRevalidator();

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) return;

    createSpace(name).then(() => {
      revalidator.revalidate();
    });

    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="secondary" className="flex gap-2" onClick={() => setOpen(true)}>
        <Plus size={16} />
        New space
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create space</DialogTitle>
        </DialogHeader>
        <form className="flex items-center gap-4" onSubmit={handleCreateSpace}>
          <Label htmlFor="name" className="text-left">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter space name here"
            autoComplete="off"
          />
        </form>
        <DialogFooter className="sm:justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCreateSpace}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpace;
