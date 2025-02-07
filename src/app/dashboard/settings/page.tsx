import { ExpandableBox } from "@/components/ui/ExpandableBox";

export default function Settings() {
  return (
    <div className="bg-black min-h-screen flex flex-col gap-4">
      <ExpandableBox title="Change Password" children={<div></div>} />
      <ExpandableBox
        title="Archive Wallet"
        children={<div>Archive Wallet</div>}
      />
    </div>
  );
}
