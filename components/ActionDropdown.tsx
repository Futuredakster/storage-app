"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPossibleExtensions } from "@/lib/utils"; 
import Image from "next/image";
import { Models } from "node-appwrite";
import { useState } from "react";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
  handler,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

interface Props {
  file: Models.Document;
  $id: string;
  accountId: string;
}

const ActionDropdown = ({ file, $id, accountId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [convertTo, setConvertTo] = useState(""); // 🆕 for convert
  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setConvertTo(""); // 🆕
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          path,
          bucketFileId: file.bucketFileId,
        }),
      // 🆕 placeholder for future conversion logic
      convert: async () => {
      if (!convertTo) {
        alert("Please select a format to convert to.");
        return false;
      }

      try {
        const response = await handler({
          fileUrl: file.url,
          inputFormat: file.extension,
          outputFormat: convertTo,
          ownerId: $id,
          accountId,
          path,
        });

        // Optionally do something with response.uploadedFile here
        console.log("Conversion and upload successful:", response);

        return true;
      } catch (error) {
        console.error("Conversion failed:", error);
        alert("Conversion failed. Check console for details.");
        return false;
      }
    },
  };
    success = await actions[action.value as keyof typeof actions]();

    if (success) {
      closeAllModals();
    }
    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>

          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {value === "details" && <FileDetails file={file} />}

          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}

          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}

          {/* 🆕 Convert Modal */}
          {value === "convert" && (
            <div className="flex flex-col gap-4">
              <p>Select format to convert:</p>
              <select
  className="border rounded px-3 py-2 bg-white text-black"
  onChange={(e) => setConvertTo(e.target.value)}
  value={convertTo}
>
  <option value="">Select format</option>
  {getPossibleExtensions(file.extension).map((ext) => (
    <option key={ext} value={ext}>
      {ext.toUpperCase()}
    </option>
  ))}
</select>

            </div>
          )}
        </DialogHeader>

        {["rename", "delete", "share", "convert"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/public/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/public/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);
                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}

          {/* 🆕 Convert Option */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="shad-dropdown-item"
            onClick={() => {
              setAction({
  value: "convert",
  label: "Convert File",
  icon: "/assets/icons/convert.svg", // ✅ placeholder icon path
});
              setIsModalOpen(true);
            }}
          >
            <Image
              src="/assets/icons/convert.svg"
              alt="convert"
              width={30}
              height={30}
            />
            Convert File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
