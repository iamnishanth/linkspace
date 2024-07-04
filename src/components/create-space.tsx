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
        new space
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>create space</DialogTitle>
        </DialogHeader>
        <form className="flex items-center gap-4" onSubmit={handleCreateSpace}>
          <Label htmlFor="name" className="text-left">
            name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="enter name here"
          />
        </form>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            cancel
          </Button>
          <Button type="submit" onClick={handleCreateSpace}>
            create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpace;
