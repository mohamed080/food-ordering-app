"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteCategory } from "../_actions/category";
import { toast } from "sonner";

type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

function DeleteCategory({ id }: { id: string }) {
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async () => {
    try {
      setState((prev) => {
        return { ...prev, isLoading: true };
      });
      const res = await deleteCategory(id);
      setState((prev) => {
        return { ...prev, message: res.message, status: res.status };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, isLoading: false };
      });
    }
  };

    useEffect(() => {
    if (state.status && state.message) {
      if (state.status === 200) {
        toast.success(state.message, {
          className: "text-green-400!",
        });
      } else {
        toast.error(state.message, {
          className: "text-destructive!",
        });
      }
    }
  }, [state.status, state.message]);
  return (
    <Button
      variant="secondary"
      disabled={state.isLoading}
      onClick={handleDelete}
    >
      <Trash2 />
    </Button>
  );
}

export default DeleteCategory;