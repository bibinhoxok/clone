"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  value?: string[]
  onChange?: (value: string[]) => void
  options?: Option[]
  placeholder?: string
  className?: string
  allowCreate?: boolean
  maxDisplayItems?: number
  handleCreateNew?: (inputValue: string) => Promise<void>
}

export default function MultiSelect({
  value = [],
  onChange,
  options: externalOptions,
  placeholder = "Select options...",
  className,
  allowCreate = true,
  maxDisplayItems = 3,
  handleCreateNew
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value || [])
  const [options, setOptions] = React.useState<Option[]>(
    externalOptions || [
      { value: "next.js", label: "Next.js" },
      { value: "sveltekit", label: "SvelteKit" },
      { value: "nuxt", label: "Nuxt.js" },
      { value: "remix", label: "Remix" },
      { value: "astro", label: "Astro" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue.js" },
      { value: "solid", label: "SolidJS" },
    ],
  )

  // Update internal value when external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value)
    }
  }, [value])

  // Handle value change
  const handleValueChange = React.useCallback(
    (newValues: string[]) => {
      setSelectedValues(newValues)
      onChange?.(newValues)
    },
    [onChange],
  )

  // Toggle a value in the selection
  const toggleValue = React.useCallback(
    (toggledValue: string) => {
      const newValues = selectedValues.includes(toggledValue)
        ? selectedValues.filter((v) => v !== toggledValue)
        : [...selectedValues, toggledValue]

      handleValueChange(newValues)
    },
    [selectedValues, handleValueChange],
  )

  // Remove a value from selection
  const removeValue = React.useCallback(
    (valueToRemove: string, e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      handleValueChange(selectedValues.filter((v) => v !== valueToRemove))
    },
    [selectedValues, handleValueChange],
  )

  

  // Get selected items as Option objects
  const selectedItems = React.useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.value))
  }, [options, selectedValues])

  // Display badges for selected items
  const selectedBadges = React.useMemo(() => {
    const displayItems = selectedItems.slice(0, maxDisplayItems)
    const remainingCount = selectedItems.length - maxDisplayItems

    return (
      <>
        {displayItems.map((item) => (
          <Badge key={item.value} variant="secondary" className="mr-1 mb-1">
            {item.label}
            <Button
              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
              onClick={(e) => removeValue(item.value, e)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="secondary" className="mb-1">
            +{remainingCount} more
          </Badge>
        )}
      </>
    )
  }, [selectedItems, maxDisplayItems, removeValue])

  return (
    <div className={cn("w-full relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", selectedValues.length > 0 ? "h-auto min-h-10" : "")}
          >
            <div className="flex flex-wrap mr-2">
              {selectedValues.length > 0 ? (
                selectedBadges
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search options..." value={inputValue} onValueChange={setInputValue} />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      toggleValue(option.value)
                      setInputValue("")
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50",
                      )}
                    >
                      {selectedValues.includes(option.value) && <Check className="h-3 w-3" />}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              {allowCreate && (
                <>
                  <Separator className="my-1" />
                  <CommandGroup>
                    {inputValue &&
                      !options.some((option) => option.label.toLowerCase() === inputValue.toLowerCase()) && (                                                
                                                <CommandItem onSelect={() => {
                                                  handleCreateNew?.(inputValue)
                                                  setInputValue("")
                                                }} className="text-primary">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create {inputValue}
                        </CommandItem>
                      )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

