import { Label } from "@/components/ui/label";

type Props = {
  required: boolean;
  name: string;
  htmfor: string;
};

const LabelComponent = ({ htmfor, required, name }: Props) => {
  return (
    <Label htmlFor={htmfor}>
      {name}
      {required && <strong className="text-red-500">*</strong>}
    </Label>
  );
};

export default LabelComponent;
