import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

interface Props {
  deleteTOTP: () => void;
  children?: React.ReactNode;
}

const DialogDefault = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <button onClick={handleOpen}>
        {props.children}
      </button>
      <Dialog
        open={open}
        handler={handleOpen}
        className="dark:bg-gray-blue-800"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          className="text-black dark:text-white"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          刪除警告！
        </DialogHeader>
        <DialogBody
          className="text-black dark:text-white font-normal"
          divider
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          請問您要刪除嗎？一經刪除就不可恢復，並且會遺失金鑰。
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1 border-1 border-red-600"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>取消</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={props.deleteTOTP}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>刪除！</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DialogDefault;