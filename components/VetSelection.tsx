import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vet {
  id: string;
  name: string;
}

const dummyVets: Vet[] = [
  { id: "1", name: "Dr. Emily Carter" },
  { id: "2", name: "Dr. Michael Johnson" },
  { id: "3", name: "Dr. Sarah Williams" },
  { id: "4", name: "Dr. David Brown" },
  { id: "5", name: "Dr. Lisa Davis" },
];

interface VetSelectionProps {
  multiple?: boolean;
  value?: string[] | string;
  onChange?: (value: string[] | string) => void;
  label?: string;
  placeholder?: string;
}

const VetSelection: React.FC<VetSelectionProps> = ({
  multiple = false,
  value,
  onChange,
  label = "Select Vet",
  placeholder = "Select vet...",
}) => {
  const [open, setOpen] = useState(false);

  if (!multiple) {
    // Single selection using Select
    return (
      <div className="grid gap-2">
        <label className="text-sm font-medium">{label}</label>
        <Select
          value={value as string || ""}
          onValueChange={(val) => onChange?.(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {dummyVets.map((vet) => (
              <SelectItem key={vet.id} value={vet.id}>
                {vet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Multiple selection using Popover and Command
  const selectedVets = (value as string[]) || [];
  const selectedVetObjects = dummyVets.filter((vet) => selectedVets.includes(vet.id));

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedVets.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedVetObjects.slice(0, 2).map((vet) => (
                  <Badge key={vet.id} variant="secondary" className="text-xs">
                    {vet.name}
                  </Badge>
                ))}
                {selectedVetObjects.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedVetObjects.length - 2} more
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search vets..." />
            <CommandList>
              <CommandEmpty>No vets found.</CommandEmpty>
              <CommandGroup>
                {dummyVets.map((vet) => {
                  const isSelected = selectedVets.includes(vet.id);
                  return (
                    <CommandItem
                      key={vet.id}
                      onSelect={() => {
                        const newSelected = isSelected
                          ? selectedVets.filter((id) => id !== vet.id)
                          : [...selectedVets, vet.id];
                        onChange?.(newSelected);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {vet.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VetSelection;
