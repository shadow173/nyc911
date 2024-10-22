// app/admin/agency-dashboard-client.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';

interface Agency {
  id: string;
  name: string;
  emailDomain: string;
  requiresManualApproval: boolean;
}

interface AdminDashboardProps {
  initialAgencies: Agency[];
  token: string;
}

export default function AgencyDashboardClient({ initialAgencies, token }: AdminDashboardProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAgency = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const newAgency = {
      name: formData.get('name'),
      emailDomain: formData.get('emailDomain'),
      requiresManualApproval: formData.get('requiresManualApproval') === 'on'
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAgency)
      });

      if (!response.ok) throw new Error('Failed to add agency');
      const { agenciesList } = await response.json();
      setAgencies(agenciesList);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Agency added successfully",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add agency",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAgency = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAgency) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const updatedAgency = {
      id: editingAgency.id,
      name: formData.get('name'),
      emailDomain: formData.get('emailDomain'),
      requiresManualApproval: formData.get('requiresManualApproval') === 'on'
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAgency)
      });

      if (!response.ok) throw new Error('Failed to update agency');
      const { agenciesList } = await response.json();
      setAgencies(agenciesList);
      setEditingAgency(null);
      toast({
        title: "Success",
        description: "Agency updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agency",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAgency = async (id: string) => {
    if (!confirm('Are you sure you want to remove this agency?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agencies/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to remove agency');
      const { agenciesList } = await response.json();
      setAgencies(agenciesList);
      toast({
        title: "Success",
        description: "Agency removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove agency",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 bg-slate-800	 dark">
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Agency Management</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your agencies and their settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Total Agencies: {agencies.length}
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                Add New Agency
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="text-primary">Add New Agency</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAgency} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Agency Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    className="bg-input"
                  />
                </div>
                <div>
                  <Label htmlFor="emailDomain" className="text-foreground">Email Domain</Label>
                  <Input 
                    id="emailDomain" 
                    name="emailDomain" 
                    required 
                    className="bg-input"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="requiresManualApproval" name="requiresManualApproval" />
                  <Label htmlFor="requiresManualApproval" className="text-foreground">
                    Requires Manual Approval
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? 'Adding...' : 'Add Agency'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email Domain</TableHead>
                <TableHead className="text-muted-foreground">Manual Approval</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={4} 
                    className="text-center text-muted-foreground"
                  >
                    No agencies found. Add your first agency to get started.
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
                  <TableRow 
                    key={agency.id} 
                    className="border-border hover:bg-muted/50"
                  >
                    <TableCell className="text-foreground">{agency.name}</TableCell>
                    <TableCell className="text-foreground">{agency.emailDomain}</TableCell>
                    <TableCell className="text-foreground">
                      {agency.requiresManualApproval ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingAgency(agency)}
                              disabled={isLoading}
                              className="border-border hover:bg-muted"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card">
                            <DialogHeader>
                              <DialogTitle className="text-primary">Edit Agency</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateAgency} className="space-y-4">
                              <div>
                                <Label htmlFor="name" className="text-foreground">Agency Name</Label>
                                <Input 
                                  id="name" 
                                  name="name" 
                                  defaultValue={agency.name}
                                  required 
                                  className="bg-input"
                                />
                              </div>
                              <div>
                                <Label htmlFor="emailDomain" className="text-foreground">Email Domain</Label>
                                <Input 
                                  id="emailDomain" 
                                  name="emailDomain" 
                                  defaultValue={agency.emailDomain}
                                  required 
                                  className="bg-input"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="requiresManualApproval" 
                                  name="requiresManualApproval"
                                  defaultChecked={agency.requiresManualApproval}
                                />
                                <Label 
                                  htmlFor="requiresManualApproval"
                                  className="text-foreground"
                                >
                                  Requires Manual Approval
                                </Label>
                              </div>
                              <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-primary hover:bg-primary/90"
                              >
                                {isLoading ? 'Updating...' : 'Update Agency'}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive"
                          onClick={() => handleRemoveAgency(agency.id)}
                          disabled={isLoading}
                          className="hover:bg-destructive/90"
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);
}
  