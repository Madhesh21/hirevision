import { CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";

const Analysis = () => {
  const matchingKeywords = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "MongoDB", "Git"];
  const missingKeywords = ["Docker", "Kubernetes", "GraphQL", "Redis", "Microservices"];

  const recommendations = [
    {
      category: "Skills",
      description: "Add Docker and Kubernetes to your technical skills section",
      impact: "High Impact",
      impactColor: "warning",
    },
    {
      category: "Format",
      description: "Use bullet points instead of paragraphs for better ATS parsing",
      impact: "Medium Impact",
      impactColor: "muted",
    },
    {
      category: "Keywords",
      description: "Include more industry-specific terms from the job description",
      impact: "High Impact",
      impactColor: "warning",
    },
    {
      category: "Experience",
      description: "Quantify your achievements with specific metrics and numbers",
      impact: "Medium Impact",
      impactColor: "muted",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userName="John Doe" showNavigation showBackToMain={false} />

      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-light text-foreground">
              ATS Analysis Results
            </h1>
            <p className="text-muted-foreground">
              Here's how your resume performs against the job description
            </p>
          </div>

          <Card className="mb-8 shadow-md">
            <CardContent className="p-8">
              <div className="text-center">
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  Overall ATS Score
                </p>
                <div className="mb-4 text-6xl font-light text-foreground">78%</div>
                <Progress value={78} className="mb-4 h-2" />
                <p className="text-sm font-medium text-success">Good ATS compatibility</p>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <CardTitle>Matching Keywords</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {matchingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-success/10 text-success">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {matchingKeywords.length} keywords found in your resume
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <CardTitle>Missing Keywords</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-warning/10 text-warning">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Consider adding these keywords to improve your score
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Recommendations for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold text-foreground">{rec.category}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Badge variant={rec.impactColor === "warning" ? "default" : "secondary"} className={rec.impactColor === "warning" ? "bg-warning text-warning-foreground" : ""}>
                      {rec.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/upload">Analyze Another Resume</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to="/chat">Start AI Interview Practice</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
