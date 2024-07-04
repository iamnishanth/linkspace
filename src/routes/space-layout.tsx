import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const SpaceLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <div className="h-10 flex items-center">
        <Button
          variant="ghost"
          className="flex gap-4 select-none cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft />
          go back
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default SpaceLayout;
