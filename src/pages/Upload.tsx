import { Upload as UploadIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation showBackToMain={false} />

      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-light text-foreground">
              Analyze Your Resume
            </h1>
            <p className="text-muted-foreground">
              Upload your resume and paste a job description to get your ATS compatibility score and personalized feedback.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  <CardTitle>Upload Resume</CardTitle>
                </div>
                <CardDescription>
                  Upload your resume in PDF or DOCX format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Choose File</Label>
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-input p-8 transition-colors hover:border-muted-foreground">
                      <div className="text-center">
                        <UploadIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="mb-1 text-sm font-medium text-foreground">
                          Choose File
                        </p>
                        <p className="text-xs text-muted-foreground">
                          No file chosen
                        </p>
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Job Description</CardTitle>
                </div>
                <CardDescription>
                  Paste the job description you're targeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px] resize-none bg-input"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" className="px-12">
              Analyze Resume
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Get your ATS compatibility score and detailed feedback in seconds
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
