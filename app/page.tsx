import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Users, Award, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">CreatorSpace</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          AI-Powered Cofounder & Campus Launchpad
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build verified projects, get mentor reviews, and launch your career. 
          From idea to portfolio-ready in weeks.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Building
            </Button>
          </Link>
          <Link href="/launch-packs">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Browse Launch Packs
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Rocket className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Launch Packs</CardTitle>
              <CardDescription>
                Structured project templates with milestones, designed for recruiter-ready portfolios
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI Guidance</CardTitle>
              <CardDescription>
                Get instant help with ideas, milestone breakdowns, and implementation checklists
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Mentor Reviews</CardTitle>
              <CardDescription>
                Get verified by experienced mentors and build your reliability score
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why CreatorSpace?</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">For Students</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Start a project in under 90 seconds</li>
              <li>✓ AI-powered guidance at every step</li>
              <li>✓ Verified portfolios that stand out</li>
              <li>✓ Build your reliability score</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">For Mentors</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Quick 10-minute micro-reviews</li>
              <li>✓ Help students build real projects</li>
              <li>✓ Impact the next generation</li>
              <li>✓ Simple checklist-based reviews</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to build something amazing?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Join students building verified projects and launching their careers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 CreatorSpace. Built for student builders.</p>
        </div>
      </footer>
    </div>
  );
}

