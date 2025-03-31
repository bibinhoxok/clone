"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useActionState } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPromotion } from "@/actions/promotionActions";
import { PromotionSchema } from "@/schemas/promotionSchema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { DateInput } from "@/components/ui/date-input";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation'

const FormSchema = PromotionSchema.extend({});

type formField =
    | {
        type: Exclude<string, "selection" | "date">;
        name: keyof z.infer<typeof FormSchema>;
        label: string;
        selections?: string[];
        placeholder?: string;
    }
    | {
        type: "selection";
        name: keyof z.infer<typeof FormSchema>;
        label: string;
        selections: string[];
        placeholder: string;
    }
    | {
        type: "date";
        name: keyof z.infer<typeof FormSchema>;
        label: string;
    };

interface State {
    message: string;
    success: boolean;
    formData?: FormData;
}

const initialState: State = {
    message: "",
    success: false,
};

export function CreatePromotionForm() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createPromotion, initialState);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const router = useRouter()

    const formFields: formField[] = useMemo(
        () => [
            { type: "text", name: "name", label: "Promotion Name" },
            { type: "text", name: "code", label: "Promotion Code" },
            {
                type: "selection",
                name: "discount_type",
                selections: ["percentage", "fixed"],
                label: "Discount Type",
                placeholder: "Select Discount Type",
            },
            { type: "number", name: "discount_value", label: "Discount Value" },
            { type: "date", name: "start_date", label: "Start Date" },
            { type: "date", name: "end_date", label: "End Date" },
            { type: "number", name: "min_order_value", label: "Min Order Value" },
            { type: "number", name: "max_discount_amount", label: "Max Discount Amount" },
            { type: "number", name: "usage_limit", label: "Usage Limit" },
        ],
        [],
    );

    const handleStartDateChange = useCallback((date: Date | undefined) => {
        setStartDate(date);
    }, []);

    const handleEndDateChange = useCallback((date: Date | undefined) => {
        setEndDate(date);
    }, []);

    const handleSubmit = useCallback(
        (formData: FormData) => {
            if (startDate && endDate) {
                formData.set("start_date", startDate.toISOString());
                formData.set("end_date", endDate.toISOString());
            }
            formAction(formData);
        },
        [startDate, endDate, formAction],
    );

    const handleSuccessClose = useCallback(
        () => {
            setOpen(false)
            if (state.success) {
                router.refresh()
            }
        },
        [state.success],
    );
    ;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create Promotion
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Promotion</DialogTitle>
                    <DialogDescription>Fill in the details to create a new promotion.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    {formFields.map((fields) => (
                        <div className="space-y-2" key={fields.name}>
                            <Label htmlFor={fields.name}>{fields.label}</Label>
                            {fields.type === "selection" ? (
                                <Select
                                    name={fields.name}
                                    defaultValue={state.formData?.get(fields.name) as string}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={fields.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fields.selections &&
                                            fields.selections.map((selection) => (
                                                <SelectItem key={selection} value={selection}>
                                                    {selection}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            ) : fields.type === "date" ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !(fields.name === "start_date" ? startDate : endDate) && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {(fields.name === "start_date" ? startDate : endDate) ? format((fields.name === "start_date" ? startDate : endDate) || new Date(), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={fields.name === "start_date" ? startDate : endDate}
                                            onSelect={fields.name === "start_date"
                                                ? handleStartDateChange
                                                : handleEndDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input
                                    id={fields.name}
                                    name={fields.name}
                                    type={fields.type}
                                    defaultValue={state.formData?.get(fields.name) as string}
                                />
                            )}
                        </div>
                    ))}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Promotion"}
                    </Button>
                    <Button
                        type="button"
                        variant={"ghost"}
                        className="mx-2"
                        onClick={handleSuccessClose}
                    >
                        Close
                    </Button>
                    {state.message && (
                        <p className={state.success ? "text-green-600" : "text-red-600"}>
                            {state.message}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
