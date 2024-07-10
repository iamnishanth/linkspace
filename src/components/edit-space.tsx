import { useRef, useState } from "react";
import { useRevalidator } from "react-router-dom";

import { Pencil } from "lucide-react";

import { deleteSpace, updateSpaceName } from "@/lib/db";
import { Space } from "@/lib/db.types";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const EditSpace = ({ space }: { space: Space }) => {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const revalidator = useRevalidator();

  const onUpdateSpaceName = () => {
    const newName = nameRef.current?.value as string;
    updateSpaceName(space.id, newName);
    setOpen(false);
    revalidator.revalidate();
  };

  const onDeleteSpace = () => {
    deleteSpace(space.id);
    setOpen(false);
    revalidator.revalidate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil size={12} />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit space</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue={space.name} ref={nameRef} />
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button type="button" variant="destructive" onClick={onDeleteSpace}>
            Delete Space
          </Button>
          <Button type="button" onClick={onUpdateSpaceName}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
