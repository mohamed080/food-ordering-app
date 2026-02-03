"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteUser } from "../_actions/user";
import { toast } from "sonner";

function DeleteUserButton({ userId }: { userId: string }) {
  const [state, setState] = useState < {
    pending: boolean;
    status: null | number;
    message: string;
  }>({
    pending: false,
    status: null,
    message: "",
  });

  const handleDelete = async (id: string) => {
      try{
          setState((prev) => {
            return { ...prev, pending: true };
          })
          const res = await deleteUser(id);
          setState((prev) => {
            return { ...prev, message: res.message, status: res.status };
          })

      }catch(err){
        console.log(err)
      } finally {
          setState((prev) => {
            return { ...prev, pending: false };
          })
      }
  }

    useEffect(() => {
      if (state.message && state.status && !state.pending) {
        if (state.status === 201 || state.status === 200) {
          toast.success(state.message, {
            className: "text-green-400!",
          });
        } else {
          toast.error(state.message, {
            className: "text-destructive!",
          });
        }
      }
    }, [state.message, state.status, state.pending]);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={state.pending}
      onClick={() => handleDelete(userId)}
    >
      <Trash2 />
    </Button>
  );
}

export default DeleteUserButton;
