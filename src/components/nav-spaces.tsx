import { Link } from "react-router-dom";

import { type Space } from "@/lib/db.types";

import { Badge } from "./ui/badge";

const NavSpaces = ({ spaces }: { spaces: Space[] }) => {
  return (
    <div className="w-full max-w-full my-2">
      <ul className="flex gap-2">
        {spaces.map((space) => (
          <Link to={`/spaces/${space.id}`} key={space.id} state="no-root-loading-indicator">
            <Badge key={space.id}>{space.name}</Badge>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default NavSpaces;
