import { Label } from "@/components/ui/label";

type Props = {
  required: boolean;
  name: string;
  htmfor: string;
};

const LabelComponent = ({ htmfor, required, name }: Props) => {
  return (
    <Label htmlFor={htmfor} className="italic">
      {name}
      {required && <strong className="text-red-500 text-2xl">*</strong>}
    </Label>
  );
};

export default LabelComponent;
