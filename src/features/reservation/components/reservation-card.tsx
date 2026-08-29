import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";

type Props = {
  id?: string;
  dateEnd: string;
  description?: string;
  status: string;
};

export const ReservationCard = ({
  id,
  status,
  dateEnd,
  description,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id || "",
      disabled: !id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`h-full w-full ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="h-full w-full rounded-none border-l-4 border-emerald-600 bg-green-300 p-2 shadow-none flex flex-col justify-between cursor-pointer">
        <div className="flex justify-between items-start text-xs font-semibold gap-1">
          <span>{status}</span>
          <span className="text-[11px] text-slate-700">{dateEnd}</span>
        </div>
        {description && (
          <p className="text-[10px] text-slate-600 italic truncate mt-1">
            {description}
          </p>
        )}
      </Card>
    </div>
  );
};

export const ReservationEmptyCard = () => {
  return (
    <Card className="h-full w-full rounded-none border border-dashed border-transparent hover:border-slate-300 hover:bg-slate-100/50 transition-all cursor-pointer flex items-center justify-center group shadow-none">
      <div>
        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">
          + Libre
        </span>
      </div>
    </Card>
  );
};
