import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy, Link, MessageCircle } from "lucide-react";
export default function SendPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Send Invitations</h1>
        <p className="text-muted-foreground">Generate and send personalized invitations to your guests.</p>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Select a group and a template to generate invitations.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Guest Group</label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="keluarga">Keluarga</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message Template</label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Wedding Invitation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="self-end">
            <Button className="w-full" disabled>Generate</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated Invitations</CardTitle>
          <CardDescription>Review and send the generated invitations below.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">Select a group and template, then click "Generate" to see the list of invitations.</p>
        </CardContent>
      </Card>
    </div>
  );
}