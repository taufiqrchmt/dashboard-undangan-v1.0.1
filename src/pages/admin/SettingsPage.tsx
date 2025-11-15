import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Event Settings</h1>
        <p className="text-muted-foreground">Configure event details for each user.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configure User Event</CardTitle>
          <CardDescription>Select a user to view or edit their event settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="user-select">Select User</Label>
            <Select>
              <SelectTrigger id="user-select">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">Fathia & Saverro (user@example.com)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold">Event Details for Fathia & Saverro</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-name">Event Name</Label>
                <Input id="event-name" value="The Wedding of Fathia & Saverro" disabled />
              </div>
              <div>
                <Label htmlFor="invitation-slug">Invitation Slug</Label>
                <Input id="invitation-slug" value="fathia-saverro" disabled />
              </div>
              <div>
                <Label htmlFor="rsvp-url">RSVP URL</Label>
                <Input id="rsvp-url" value="https://example.com/rsvp" disabled />
              </div>
              <div>
                <Label htmlFor="rsvp-password">RSVP Password</Label>
                <Input id="rsvp-password" value="rsvp" disabled />
              </div>
            </div>
            <div className="flex justify-end">
              <Button disabled>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}