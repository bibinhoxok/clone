"use client"

import type React from "react"
import { useState, useActionState, useEffect, useReducer, useCallback, memo } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProduct } from "@/actions/productActions"
import { ActionReturn, CreateAction, FormState, Selection } from "@next-server-actions/types"
import { ProductSchema } from "@/schemas/productSchema"
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import { useToast } from "@/lib/custom-hooks"
import { Button } from "@/components/ui/button"
import SearchableSelect from "@/components/searchable-select"
import { createCategory } from "@/actions/categoryActions"
import { Loader2 } from "lucide-react"
import MultiSelect, { Option } from "@/components/multi-select"
import { createSkinType } from "@/actions/skinTypeActions"

const ExtendedProductSchema = ProductSchema.extend({ skintype_recomendation: z.array(z.string()) })
type ProductFormValues = z.infer<typeof ExtendedProductSchema>

const initialState: FormState = {
    message: "",
    success: false,
};
const initialProductState: ProductFormValues = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category_id: "",
    is_active: false,
    image_url: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    skintype_recomendation: [],
};

// Reducer function for managing product state
type ProductAction =
    | { type: 'UPDATE_FIELD'; field: keyof ProductFormValues; value: any }
    | { type: 'RESET' };

const productReducer = (state: ProductFormValues, action: ProductAction): ProductFormValues => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'RESET':
            return initialProductState;
        default:
            return state;
    }
};

// Custom form field component
const FormField = memo(({
    name,
    label,
    children,
    description,
}: {
    name: keyof ProductFormValues
    label: string
    children: React.ReactNode
    description?: string
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name.toString()}>{label}</Label>
            {children}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
});

export function AddProductForm({ onProductAdded }: { onProductAdded?: () => void }) {
    const [imageLink, setImageLink] = useState<string | undefined>()
    const [state, formAction, isPending] = useActionState(createProduct, initialState);
    const [productState, dispatch] = useReducer(productReducer, initialProductState);
    const [categorySelections, setCategorySelections] = useState<Selection[]>([])
    const [skintypeSelections, setSkintypeSelections] = useState<Option[]>([]) // Change type here
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategoryData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/category')
            if (!res.ok) {
                throw new Error(`Failed to fetch categories: ${res.statusText}`);
            }
            const rawData = await res.json();
            const formattedData: Selection[] = rawData.data.map((item: any) => ({
                value: item._id,
                label: item.name
            }))
            setCategorySelections(formattedData)
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchSkinTypeData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/skinType')
            if (!res.ok) {
                throw new Error(`Failed to fetch skin types: ${res.statusText}`);
            }
            const rawData = await res.json();
            const formattedData: Option[] = rawData.data.map((item: any) => ({ // Change type here
                value: item._id,
                label: item.name
            }))
            setSkintypeSelections(formattedData)
        } catch (error) {
            console.error("Error fetching skin types:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryData()
        fetchSkinTypeData()
    }, [])


    const OurUploadDropzone = useCallback(({ ...props }) => (
        <div {...props}>
            <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                config={{ cn: twMerge }}
                onClientUploadComplete={(res) => {
                    const link = res.find((file) => file.ufsUrl)?.ufsUrl
                    dispatch({
                        type: 'UPDATE_FIELD',
                        field: "image_url",
                        value: link,
                    })
                    useToast("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    useToast(`ERROR! ${error.message}`);
                }}
            />
        </div>
    ), []);


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: keyof ProductFormValues) => {
        const value = e.target.value;
        dispatch({
            type: 'UPDATE_FIELD',
            field: name,
            value: name === "price" || name === "quantity" ? Number(value) : value,
        });
    }, []);

    const handleCheckboxChange = useCallback((e: boolean, name: keyof ProductFormValues) => {
        dispatch({ type: 'UPDATE_FIELD', field: name, value: e });
    }, []);

    const handleCreateNewSelection = useCallback(async (prevState: any, formData: FormData): Promise<ActionReturn> => {
        const result = createCategory(prevState, formData).then((res) => {
            if (res.success) {
                fetchCategoryData()
            }
            return res
        })
        return result
    }, [])

    const handleCreateNewSkinTypeSelection = useCallback(async (inputValue: string): Promise<void> => {
        const formData = new FormData();
        formData.append('name', inputValue);
        const result = await createSkinType(initialState, formData);
        if (result.success) {
            fetchSkinTypeData()
        }
        useToast(result.message)
    }, [])

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        for (const key in productState) {
            if (productState.hasOwnProperty(key)) {
                const value = productState[key as keyof ProductFormValues];
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value !== undefined && value !== null) {
                    if (key === 'createdAt' || key === 'updatedAt') {
                        formData.append(key, Date.now().toString());
                    } else if (Array.isArray(value)) {
                        value.forEach((item) => formData.append(key, item));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            }
        }
        const result = await createProduct(initialState, formData);
        useToast(result.message)
        if (result.success) {
            dispatch({ type: 'RESET' })
            onProductAdded?.()
        }
        setIsSubmitting(false);
    };

    const handleMultiSelectChange = useCallback((values: string[]) => {
        dispatch({
            type: 'UPDATE_FIELD',
            field: "skintype_recomendation",
            value: values,
        });
    }, []);

    return (
        <form id="add-product-form" className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="media">Media & Options</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                    <FormField name="name" label="Name">
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={productState.name}
                            onChange={(e) => handleInputChange(e, "name")}
                            placeholder="Product name"
                        />
                    </FormField>

                    <FormField name="description" label="Description">
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your product"
                            value={productState.description}
                            onChange={(e) => handleInputChange(e, "description")}
                            className="min-h-24"

                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="price" label="Price">
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                value={productState.price}
                                onChange={(e) => handleInputChange(e, "price")}

                            />
                        </FormField>

                        <FormField name="quantity" label="Quantity">
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={productState.quantity}
                                onChange={(e) => handleInputChange(e, "quantity")}
                                placeholder="0"

                            />
                        </FormField>
                    </div>

                    <FormField name="category_id" label="Category">
                        {isLoading ? (
                            <div>Loading categories...</div>
                        ) : (
                            <SearchableSelect
                                selections={categorySelections}
                                createNewSelection={handleCreateNewSelection}
                                value={productState.category_id.toString()}
                                onChange={(value) => {
                                    dispatch({
                                        type: 'UPDATE_FIELD',
                                        field: "category_id",
                                        value: value,
                                    })
                                }}
                                placeholder="select category..."
                            />
                        )}
                    </FormField>

                    <FormField name="skintype_recomendation" label="Skin Type Recommendation">
                        {isLoading ? (
                            <div>Loading skin type recommendations...</div>
                        ) : (
                            <MultiSelect
                                options={skintypeSelections}
                                allowCreate={true}
                                value={productState.skintype_recomendation}
                                onChange={handleMultiSelectChange}
                                handleCreateNew={handleCreateNewSkinTypeSelection} 
                                placeholder="Select skin type recommendations..."
                            />
                        )}
                    </FormField>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 pt-4">
                    {productState.image_url ? (
                        <div className="flex flex-col justify-center items-center">
                            <Image
                                src={productState.image_url}
                                width={500}
                                height={500}
                                alt="Product Image"

                            />
                            <Button className="m-4" onClick={() => dispatch({
                                type: 'UPDATE_FIELD',
                                field: "image_url",
                                value: undefined,
                            })}>Cancel</Button>
                        </div>
                    ) : (
                        <OurUploadDropzone className="flex flex-col items-center justify-between p-0" />
                    )
                    }

                    <FormField name="is_active" label="Active">
                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <Checkbox
                                id="is_active"
                                checked={productState.is_active}
                                onCheckedChange={(checked) => {
                                    handleCheckboxChange(!!checked, "is_active");
                                }}
                            />
                            <div className="space-y-1 leading-none">
                                <Label htmlFor="is_active" defaultChecked={true}>Active</Label>
                                <p className="text-sm text-muted-foreground">This product will be visible to customers.</p>
                            </div>
                        </div>
                    </FormField>
                </TabsContent>
            </Tabs>
            {state.message && (
                <p className={state.success ? "text-green-600" : "text-red-600"}>
                    {state.message}
                </p>
            )}
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
        </form>
    )
}
