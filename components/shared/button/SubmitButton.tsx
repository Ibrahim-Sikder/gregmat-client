import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface ButtonProps {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function SubmitButton({ title, loading, icon }: ButtonProps) {
  return (
    <Button type="submit" disabled={loading} className="w-full cursor-pointer">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </>
      )}
    </Button>
  );
}
