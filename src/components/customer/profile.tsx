"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { Customer } from "@/schemas/customerSchema"
import { useState, useEffect } from "react";
import { format } from 'date-fns';

export function CustomerProfile() {
    const { status, data: session } = useSession();
    const [user, setUser] = useState<Customer | null>(null);
    const [gender, setGender] = useState<string>("");
    const [day, setDay] = useState<string>("");
    const [month, setMonth] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [dob, setDob] = useState<Date | null>(null);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phone, setPhone] = useState<string>("");

    useEffect(() => {
        if (session?.user) {
            const customer = session.user as Customer;
            setUser(customer)
            if (customer.phone) setPhone(customer.phone);
            if (customer.date_of_birth) {
                setDob(new Date(customer.date_of_birth));
                setDay(format(new Date(customer.date_of_birth), 'd'));
                setMonth(format(new Date(customer.date_of_birth), 'M'));
                setYear(format(new Date(customer.date_of_birth), 'yyyy'));
            }
        }
    }, [session]);

    useEffect(() => {
        if (dob) {
            setDay(format(dob, 'd'));
            setMonth(format(dob, 'M'));
            setYear(format(dob, 'yyyy'));
        }
    }, [dob]);

    if (status === "loading") {
        return <>Loading</>;
    }
    if (!session || !user) {
        return <>Not logged in</>;
    }

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };

    const handleSavePhone = () => {
        // Here you would typically send a request to update the phone number on the server
        console.log("Saving new phone number:", phone);
        setIsEditingPhone(false);
    };

    const handleGenderChange = (value: string) => {
        setGender(value);
    };

    const handleDayChange = (value: string) => {
        setDay(value);
        if (month && year) {
            setDob(new Date(parseInt(year), parseInt(month) - 1, parseInt(value)));
        }
    };

    const handleMonthChange = (value: string) => {
        setMonth(value);
        if (day && year) {
            setDob(new Date(parseInt(year), parseInt(value) - 1, parseInt(day)));
        }
    };

    const handleYearChange = (value: string) => {
        setYear(value);
        if (day && month) {
            setDob(new Date(parseInt(value), parseInt(month) - 1, parseInt(day)));
        }
    };

    const handleSaveChanges = () => {
        // Here you would typically send a request to update the user's profile on the server
        console.log("Saving changes:", { gender, dob });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Profile</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-32 h-32">
                            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Customer avatar" />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 space-y-4">

                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} readOnly className="flex-1" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center gap-2">
                                <Input id="email" defaultValue={user.email} readOnly className="flex-1" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center gap-2">
                                {isEditingPhone ? (
                                    <>
                                        <Input id="phone" value={phone} onChange={handlePhoneChange} className="flex-1" />
                                        <Button variant="outline" size="sm" onClick={handleSavePhone}>
                                            Save
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setIsEditingPhone(false)}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Input id="phone" value={phone} readOnly className="flex-1" />
                                        <Button variant="outline" size="sm" onClick={() => setIsEditingPhone(true)}>
                                            Change
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Date of Birth</Label>
                        <div className="flex gap-2">
                            <Select onValueChange={handleDayChange} value={day}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                        <SelectItem key={day} value={day.toString()}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={handleMonthChange} value={month}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <SelectItem key={month} value={month.toString()}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={handleYearChange} value={year}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Button className="w-full md:w-auto" onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
        </Card>
    );
}
