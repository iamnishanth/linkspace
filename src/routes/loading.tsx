import { cn } from "@/lib/utils";

type LoadingProps = {
  children?: React.ReactNode;
  className?: string;
};

const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={cn("flex items-center justify-center bg-background", className)}>
      Loading...
    </div>
  );
};

export default Loading;
