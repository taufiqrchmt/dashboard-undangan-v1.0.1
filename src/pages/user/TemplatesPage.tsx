import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const mockTemplates = [
  { name: "Default Wedding Invitation", scope: "global", is_default: true, content: "*💌 Wedding Invitation*\\n\\nTo: *[nama-tamu]*..." },
  { name: "Casual Invite (Friends)", scope: "user", is_default: false, content: "Hey [nama-tamu]! 👋\\n\\nWe're getting married!..." },
];
export default function UserTemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground">Create and manage your invitation messages.</p>
        </div>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>
      <div className="grid gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{template.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {template.is_default && <Badge>Default</Badge>}
                  <Badge variant={template.scope === 'global' ? 'secondary' : 'outline'}>
                    {template.scope === 'global' ? 'Global' : 'My Template'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                {template.content.substring(0, 150)}...
              </p>
              <div className="text-right mt-4">
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}