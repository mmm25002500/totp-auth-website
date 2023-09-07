import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  deleteTOTP: () => void;
}
 
const DialogDefault = (props: Props) => {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <button onClick={handleOpen}>
        <FontAwesomeIcon icon={faCircleXmark} className="w-8 text-red-500" />
      </button>
      <Dialog open={open} handler={handleOpen} className="dark:bg-gray-800">
        <DialogHeader className="text-black dark:text-white">刪除警告！</DialogHeader>
        <DialogBody className="text-black dark:text-white font-normal" divider>
          請問您要刪除嗎？一經刪除就不可恢復，並且會遺失金鑰。
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1 border-1 border-red-600"
          >
            <span>取消</span>
          </Button>
          <Button variant="gradient" color="green" onClick={props.deleteTOTP}>
            <span>刪除！</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DialogDefault;