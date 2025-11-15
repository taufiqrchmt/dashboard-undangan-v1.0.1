import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
const mockGuests = [
  { name: "Linda & Keluarga", phone: "6281234567890", group: "VIP", is_sent: true },
  { name: "Budi Santoso", phone: "6281234567891", group: "Keluarga", is_sent: false },
];
export default function GuestsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Guests</h1>
          <p className="text-muted-foreground">Manage your guest list.</p>
        </div>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
          <CardDescription>A complete list of all your invited guests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGuests.map((guest) => (
                <TableRow key={guest.name}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{guest.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={guest.is_sent ? "default" : "outline"}>
                      {guest.is_sent ? "Sent" : "Not Sent"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" disabled>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}