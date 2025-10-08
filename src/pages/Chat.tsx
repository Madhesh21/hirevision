import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewMode, setInterviewMode] = useState(null); // null, 'practice', or 'structured'
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if session exists
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setMessages([{
        role: "assistant",
        content: "Welcome! Please upload your resume first from the upload page to start practicing.",
        time: new Date().toLocaleTimeString(),
      }]);
    } else {
      setMessages([{
        role: "assistant",
        content: "Hello! I'm your AI interview assistant. Choose how you'd like to practice:\n\n1. Free Practice - Have a natural conversation about your experience\n2. Structured Interview - Answer 5 questions with a difficulty level",
        time: new Date().toLocaleTimeString(),
      }]);
    }
  }, []);

  const startStructuredInterview = async (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setInterviewMode('structured');
    setCurrentQuestion(1);
    setAnswers([]);
    
    const startMessage = {
      role: "assistant",
      content: `Great! Starting ${selectedDifficulty.toUpperCase()} difficulty interview. I'll ask you 5 questions based on your resume. Take your time to answer each one thoughtfully.`,
      time: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, startMessage]);
    
    // Get first question
    await askQuestion(selectedDifficulty, 1);
  };

  const startFreePractice = () => {
    setInterviewMode('practice');
    const startMessage = {
      role: "assistant",
      content: "Perfect! Let's have a conversation about your experience. Feel free to ask me anything or tell me about yourself, and I'll help you practice your interview skills.",
      time: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, startMessage]);
  };

  // const askQuestion = async (diff, questionNum) => {
  //   setIsLoading(true);
    
  //   try {
  //     const sessionId = localStorage.getItem('sessionId');
      
  //     const response = await fetch("http://localhost:3000/conversation", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         message: `Question ${questionNum}`,
  //         sessionId: sessionId,
  //         action: "ask_question",
  //         difficulty: diff,
  //         questionNumber: questionNum,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to get question");
  //     }

  //     const data = await response.json();

  //     const questionMessage = {
  //       role: "assistant",
  //       content: `Question ${questionNum}/5:\n\n${data.question}`,
  //       time: new Date().toLocaleTimeString(),
  //     };

  //     setMessages((prev) => [...prev, questionMessage]);
  //   } catch (error) {
  //     console.error("Error getting question:", error);
      
  //     const errorMessage = {
  //       role: "assistant",
  //       content: "I apologize, but I'm having trouble generating a question. Please try again.",
  //       time: new Date().toLocaleTimeString(),
  //     };

  //     setMessages((prev) => [...prev, errorMessage]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const askQuestion = async (diff, questionNum) => {
  setIsLoading(true);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const errorMessage = {
        role: "assistant",
        content: "Authentication error. Please sign in again.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    
    const response = await fetch("http://localhost:3000/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        message: `Question ${questionNum}`,
        sessionId: sessionId,
        action: "ask_question",
        difficulty: diff,
        questionNumber: questionNum,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get question");
    }

    const data = await response.json();

    const questionMessage = {
      role: "assistant",
      content: `Question ${questionNum}/5:\n\n${data.question}`,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, questionMessage]);
  } catch (error) {
    console.error("Error getting question:", error);
    
    const errorMessage = {
      role: "assistant",
      content: "I apologize, but I'm having trouble generating a question. Please try again.",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

const evaluateAnswers = async () => {
  setIsLoading(true);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const errorMessage = {
        role: "assistant",
        content: "Authentication error. Please sign in again.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    
    const response = await fetch("http://localhost:3000/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        message: "Evaluate my interview",
        sessionId: sessionId,
        action: "evaluate",
        difficulty: difficulty,
        answers: answers,
        userId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get evaluation");
    }

    const data = await response.json();

    const evaluationMessage = {
      role: "assistant",
      content: `Interview Complete! Here's your evaluation:\n\n${data.evaluation}`,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, evaluationMessage]);
    
    // Reset for new interview
    setInterviewMode(null);
    setDifficulty(null);
    setCurrentQuestion(0);
    setAnswers([]);
    
    // Offer to start again
    setTimeout(() => {
      const restartMessage = {
        role: "assistant",
        content: "Would you like to practice again? Choose Free Practice or Structured Interview with a difficulty level.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, restartMessage]);
    }, 2000);
    
  } catch (error) {
    console.error("Error getting evaluation:", error);
    
    const errorMessage = {
      role: "assistant",
      content: "I apologize, but I'm having trouble generating the evaluation. Please try again.",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
  
  
const sendMessage = async () => {
  if (!inputValue.trim() || isLoading) return;

  const userMessage = {
    role: "user",
    content: inputValue,
    time: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  
  // Save answer if in structured mode
  if (interviewMode === 'structured') {
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      answer: inputValue,
    }]);
  }
  
  const currentInput = inputValue;
  setInputValue("");
  setIsLoading(true);

  try {
    // Get current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      const errorMessage = {
        role: "assistant",
        content: "Please sign in to continue the interview practice.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    
    if (!sessionId) {
      const errorMessage = {
        role: "assistant",
        content: "Please upload your resume first from the upload page to start the interview practice.",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      return;
    }

    // If in structured mode, handle differently
    if (interviewMode === 'structured') {
      // After answering, move to next question or evaluate
      if (currentQuestion < 5) {
        const nextQ = currentQuestion + 1;
        setCurrentQuestion(nextQ);
        await askQuestion(difficulty, nextQ);
      } else {
        // All 5 questions answered, evaluate
        await evaluateAnswers();
      }
    } else {
      // Free practice mode - regular chat
      const response = await fetch("http://localhost:3000/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionId,
          action: "chat",
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.answer || data.question || data.message || "I apologize, but I couldn't generate a response.",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    
    const errorMessage = {
      role: "assistant",
      content: "I apologize, but I'm having trouble connecting to the server. Please try again.",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
              {interviewMode === 'structured' 
                ? `${difficulty?.toUpperCase()} Difficulty - Question ${currentQuestion}/5`
                : "Practice with personalized questions based on your resume"}
            </p>
          </div>

          {!interviewMode && messages.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={startFreePractice}
                variant="outline"
                className="px-6"
              >
                Free Practice
              </Button>
              <Button
                onClick={() => startStructuredInterview('easy')}
                className="bg-green-600 px-6 hover:bg-green-700"
              >
                Easy Interview
              </Button>
              <Button
                onClick={() => startStructuredInterview('medium')}
                className="bg-yellow-600 px-6 hover:bg-yellow-700"
              >
                Medium Interview
              </Button>
              <Button
                onClick={() => startStructuredInterview('hard')}
                className="bg-red-600 px-6 hover:bg-red-700"
              >
                Hard Interview
              </Button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-success/10">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-success" />
                      {interviewMode === 'structured' ? 'Structured Interview' : interviewMode === 'practice' ? 'Free Practice' : 'AI Interview Assistant'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4 overflow-y-auto" style={{ minHeight: "400px", maxHeight: "500px" }}>
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
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <p className="mt-2 text-xs opacity-70">{message.time}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg bg-muted p-4">
                          <div className="flex gap-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "0ms" }} />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "150ms" }} />
                            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={interviewMode ? "Type your answer here..." : "Choose a mode to start..."}
                      className="flex-1 bg-input"
                      disabled={isLoading || !interviewMode}
                    />
                    <Button 
                      size="icon" 
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim() || !interviewMode}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {interviewMode ? "Press Enter to send, or use the Send button" : "Select a practice mode above to begin"}
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