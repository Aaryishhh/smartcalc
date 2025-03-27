"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-2"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

export function AboutPageClient() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
          About VSmart
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Empowering businesses and individuals with intelligent financial tools for better decision making.
        </p>
      </div>

      {/* Company Overview */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-2 border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            At VSmart, we are dedicated to transforming complex financial calculations into intuitive, accessible tools.
            Our mission is to empower individuals and businesses to make informed financial decisions through innovative technology solutions.
          </p>
          <p>
            With a focus on accuracy, usability, and comprehensive tax knowledge, we've developed a suite of calculators that simplify
            the often confusing world of taxes and financial planning.
          </p>
        </CardContent>
      </Card>

      {/* Services Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Tax Calculators"
            description="Comprehensive set of tax calculators covering income tax, capital gains, VAT, and more for various regions."
            icon={<span className="text-lg">💼</span>}
          />
          <FeatureCard
            title="Financial Tools"
            description="Tools for financial planning, investment analysis, and budget management to support your financial goals."
            icon={<span className="text-lg">📊</span>}
          />
          <FeatureCard
            title="Custom Applications"
            description="Bespoke financial applications developed to meet the specific needs of businesses and organizations."
            icon={<span className="text-lg">🔧</span>}
          />
          <FeatureCard
            title="Tax Education"
            description="Resources to help understand tax implications for various financial decisions and business structures."
            icon={<span className="text-lg">📚</span>}
          />
          <FeatureCard
            title="Business Solutions"
            description="Specialized tools for businesses including payroll tax calculators and business expense analyzers."
            icon={<span className="text-lg">🏢</span>}
          />
          <FeatureCard
            title="API Integrations"
            description="Integration services to connect our tax calculators with your existing business systems and workflows."
            icon={<span className="text-lg">🔄</span>}
          />
        </div>
      </div>

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader>
          <CardTitle className="text-2xl">Need Custom Financial Tools?</CardTitle>
          <CardDescription>
            If you need specialized calculators or financial applications for your business, we can help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Our team specializes in creating customized financial tools tailored to your specific requirements.
            Whether you need specialized tax calculators, financial planning tools, or complete financial management systems,
            we have the expertise to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="mailto:learningtechnology2@gmail.com"
              className="contact-link-large"
              aria-label="Contact VSmart at info@vsmart.com"
            >
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <EmailIcon />
                Contact: info@vsmart.com
              </Button>
            </a>
            <Link href="/" passHref>
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Calculators
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Copyright Notice */}
      <div className="copyright-notice">
        <p>
          © {new Date().getFullYear()} VSmart. All rights reserved.
          <span className="contact-container">
            <a
              href="mailto:learningtechnology2@gmail.com"
              className="contact-link"
              aria-label="Contact VSmart at info@vsmart.com"
            >
              Contact: info@vsmart.com
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
