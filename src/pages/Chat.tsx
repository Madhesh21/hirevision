import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Chat = () => {
  const [messages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI interview assistant. I'll ask you questions based on your resume and the job you're targeting. Let's start with a simple question: Can you tell me about yourself and your background?",
      time: "10:50:49 PM",
    },
  ]);

  const bestPractices = [
    "Use the STAR method (Situation, Task, Action, Result)",
    "Provide specific examples with measurable outcomes",
    "Be concise but thorough in your responses",
  ];

  const focusPoints = [
    "Highlight achievements relevant to the role",
    "Show problem-solving and critical thinking",
    "Demonstrate cultural fit and enthusiasm",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showNavigation backToMainUrl="/upload" />

      <main className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-light text-foreground">
              AI Interview Practice
            </h1>
            <p className="text-sm text-muted-foreground">
              Practice with personalized questions based on your resume
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-success/10">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-success" />
                      AI Interview Assistant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4" style={{ minHeight: "400px" }}>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "assistant" ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "assistant"
                              ? "bg-muted text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="mt-2 text-xs opacity-70">{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response here..."
                      className="flex-1 bg-input"
                    />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Press Enter to send, or use the Send button
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Interview Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Best Practices:
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {bestPractices.map((practice, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-success">•</span>
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        What to Focus On:
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {focusPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-success">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
