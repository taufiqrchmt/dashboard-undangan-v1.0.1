import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact, UsersRound, Send, CheckCircle2 } from "lucide-react";
const stats = [
  { title: "Total Guests", value: "2", icon: Contact },
  { title: "Guest Groups", value: "2", icon: UsersRound },
  { title: "Invitations Sent", value: "1", icon: Send },
  { title: "RSVPs Received", value: "0", icon: CheckCircle2 },
];
export default function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a summary of your event.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your event, <span className="font-semibold text-foreground">The Wedding of Fathia & Saverro</span>, is active.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Invitation URL Slug: <code className="bg-slate-100 dark:bg-slate-800 p-1 rounded">/fathia-saverro/</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}