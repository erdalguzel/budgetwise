"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAiInsightsAction } from "@/lib/actions";
import type { Transaction, BudgetGoal } from "@/lib/types";

interface AiAssistantCardProps {
  transactions: Transaction[];
  budgetGoals: BudgetGoal[];
}

export default function AiAssistantCard({ transactions, budgetGoals }: AiAssistantCardProps) {
  const { toast } = useToast();
  const [timeline, setTimeline] = React.useState<string>("end of this month");
  const [insights, setInsights] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleGetInsights = async () => {
    setIsLoading(true);
    setInsights(null);

    const input = {
      transactions: JSON.stringify(transactions),
      budgetGoals: JSON.stringify(budgetGoals),
      timeline: timeline,
    };

    const result = await getAiInsightsAction(input);

    if (result.success && result.data) {
      setInsights(result.data.insights);
      toast({
        title: "Insights Generated!",
        description: "AI assistant has provided recommendations.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to get insights from AI assistant.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          <CardTitle className="font-headline">AI Budget Assistant</CardTitle>
        </div>
        <CardDescription>
          Get smart spending insights and personalized recommendations to achieve your budget goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="timeline">Timeline to achieve goals:</Label>
          <Input
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g., end of this month, next 30 days"
          />
        </div>
        
        {/* For demo, transactions and budget goals are passed as props. 
            In a real app, these might be displayed or confirmed here.
            We'll just show a message that they are being used. */}
        <p className="text-sm text-muted-foreground">
          Using your current transactions and budget goals for analysis.
        </p>

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Generating insights...</p>
          </div>
        )}

        {insights && (
          <div className="mt-4 p-4 bg-accent/10 rounded-md border border-accent/30">
            <h4 className="font-semibold text-accent mb-2">Personalized Insights:</h4>
            <p className="text-sm whitespace-pre-wrap">{insights}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetInsights} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Get Insights"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
