"use client";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";
import { Calculator, Euro, Percent, TrendingUp, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type RoiCalculatorSectionClientProps = {
  locale: string;
  label: string;
  headline: string;
  subtitle: string;
  description: string;
  yourMetrics: string;
  metricsDescription: string;
  monthlyVisitors: string;
  conversionRate: string;
  avgOrderValue: string;
  projectedImprovement: string;
  upliftDescription: string;
  potentialReturns: string;
  potentialDescription: string;
  extraYearlyRevenue: string;
  monthlyGrowth: string;
  projectedAnnual: string;
  currentMonthlyRevenue: string;
  projectedMonthlyRevenue: string;
  chartCurrent: string;
  chartProjected: string;
  disclaimer: string;
};

export function RoiCalculatorSectionClient({
  locale,
  label,
  headline,
  subtitle,
  description,
  yourMetrics,
  metricsDescription,
  monthlyVisitors,
  conversionRate: conversionRateLabel,
  avgOrderValue,
  projectedImprovement,
  upliftDescription,
  potentialReturns,
  potentialDescription,
  extraYearlyRevenue,
  monthlyGrowth,
  projectedAnnual,
  currentMonthlyRevenue,
  projectedMonthlyRevenue,
  chartCurrent,
  chartProjected,
  disclaimer,
}: RoiCalculatorSectionClientProps) {
  const [visitors, setVisitors] = useState(10000);
  const [conversionRate, setConversionRate] = useState(1.5);
  const [orderValue, setOrderValue] = useState(50);
  const [uplift, setUplift] = useState(0.5);

  const currentRevenue = useMemo(() => {
    return visitors * (conversionRate / 100) * orderValue;
  }, [visitors, conversionRate, orderValue]);

  const projectedRevenue = useMemo(() => {
    return visitors * ((conversionRate + uplift) / 100) * orderValue;
  }, [visitors, conversionRate, orderValue, uplift]);

  const monthlyUplift = projectedRevenue - currentRevenue;
  const yearlyUplift = monthlyUplift * 12;

  const chartData = useMemo(
    () => [
      {
        name: chartCurrent,
        revenue: currentRevenue,
        fill: "var(--color-current)",
      },
      {
        name: chartProjected,
        revenue: projectedRevenue,
        fill: "var(--color-projected)",
      },
    ],
    [currentRevenue, projectedRevenue, chartCurrent, chartProjected]
  );

  const chartConfig = {
    current: {
      label: chartCurrent,
      theme: {
        light: "hsl(var(--muted))",
        dark: "rgba(255, 255, 255, 0.2)",
      },
    },
    projected: {
      label: chartProjected,
      theme: {
        light: "hsl(221.2, 83.2%, 53.3%)", // A vibrant blue for light mode
        dark: "#ffffff",
      },
    },
  } satisfies ChartConfig;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-EU" : locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale).format(value);
  };

  const formatShortCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-EU" : locale, {
      notation: "compact",
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <section
      id="roi-calculator"
      className="scroll-mt-24 relative py-12 md:py-16 min-h-screen"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 overflow-x-hidden">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {label}
          </p>
          <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl text-balance">
            {headline}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {subtitle}
          </p>
          {description && (
            <p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-lg text-pretty italic opacity-80">
              {description}
            </p>
          )}
        </AnimatedContainer>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-5">
          <AnimatedContainer
            trigger="scroll"
            fadeDirection="left"
            className="lg:col-span-2"
          >
            <Card className="h-full border-muted bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{yourMetrics}</CardTitle>
                <CardDescription>{metricsDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-medium flex items-center gap-2 min-w-0">
                      <Users className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{monthlyVisitors}</span>
                    </span>
                    <span className="font-mono bg-muted px-2 py-1 rounded-md text-sm shrink-0">
                      {formatNumber(visitors)}
                    </span>
                  </div>
                  <Slider
                    value={[visitors]}
                    min={1000}
                    max={500000}
                    step={1000}
                    onValueChange={(v) => setVisitors(v[0])}
                    className="py-2"
                    aria-label={monthlyVisitors}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-medium flex items-center gap-2 min-w-0">
                      <Percent className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{conversionRateLabel}</span>
                    </span>
                    <span className="font-mono bg-muted px-2 py-1 rounded-md text-sm shrink-0">
                      {conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[conversionRate]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(v) => setConversionRate(v[0])}
                    className="py-2"
                    aria-label={conversionRateLabel}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-medium flex items-center gap-2 min-w-0">
                      <Euro className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{avgOrderValue}</span>
                    </span>
                    <span className="font-mono bg-muted px-2 py-1 rounded-md text-sm shrink-0">
                      {formatCurrency(orderValue)}
                    </span>
                  </div>
                  <Slider
                    value={[orderValue]}
                    min={10}
                    max={1000}
                    step={5}
                    onValueChange={(v) => setOrderValue(v[0])}
                    className="py-2"
                    aria-label={avgOrderValue}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-medium flex items-center gap-2 text-primary min-w-0">
                        <TrendingUp className="w-4 h-4 shrink-0" />
                        <span className="truncate">{projectedImprovement}</span>
                      </span>
                      <span className="font-mono bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-bold shrink-0">
                        +{uplift.toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[uplift]}
                      min={0.1}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => setUplift(v[0])}
                      className="py-2"
                      aria-label={projectedImprovement}
                    />
                    <p className="text-xs text-muted-foreground">
                      {upliftDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>

          <AnimatedContainer
            trigger="scroll"
            fadeDirection="right"
            className="lg:col-span-3"
          >
            <Card className="h-full bg-card border-muted dark:bg-zinc-950 dark:text-white dark:border-zinc-800 overflow-hidden relative shadow-2xl flex flex-col w-full min-w-0">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-50 dark:bg-primary/20" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl opacity-50 dark:bg-blue-500/10" />

              <CardHeader className="relative z-10 pb-6">
                <div className="flex flex-col gap-5 md:gap-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 min-w-0 space-y-2">
                      <CardTitle className="flex items-center gap-2 text-xl md:text-xl lg:text-2xl">
                        <Calculator className="w-5 h-5 md:w-5 md:h-5 text-primary shrink-0" />
                        <span className="wrap-break-word">{potentialReturns}</span>
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base wrap-break-word leading-relaxed">
                        {potentialDescription.replace(
                          "{uplift}",
                          uplift.toString()
                        )}
                      </CardDescription>
                    </div>
                    <div className="text-left md:text-right shrink-0 pt-2 md:pt-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        {extraYearlyRevenue}
                      </p>
                      <p className="text-xl md:text-2xl lg:text-2xl font-bold text-primary leading-tight">
                        +{formatCurrency(yearlyUplift)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 md:space-y-8 relative z-10 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-muted/30 dark:bg-zinc-900/50 border border-muted dark:border-zinc-800 p-3 sm:p-4 rounded-xl min-w-0 w-full overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">
                      {monthlyGrowth}
                    </p>
                    <div className="text-sm sm:text-base md:text-lg font-bold tracking-tight leading-tight wrap-break-word">
                      +{formatCurrency(monthlyUplift)}
                    </div>
                  </div>
                  <div className="bg-muted/30 dark:bg-zinc-900/50 border border-muted dark:border-zinc-800 p-3 sm:p-4 rounded-xl min-w-0 w-full overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wider">
                      {projectedAnnual}
                    </p>
                    <div className="text-sm sm:text-base md:text-lg font-bold tracking-tight leading-tight wrap-break-word">
                      {formatCurrency(projectedRevenue * 12)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-[250px] w-full mt-4 overflow-x-auto">
                  <ChartContainer
                    config={chartConfig}
                    className="h-full w-full min-w-[280px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "hsl(var(--muted-foreground))",
                            fontSize: 12,
                          }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "hsl(var(--muted-foreground))",
                            fontSize: 10,
                          }}
                          tickFormatter={formatShortCurrency}
                          width={35}
                          domain={[0, "dataMax + 5000"]}
                        />
                        <ChartTooltip
                          cursor={{
                            fill: "hsl(var(--foreground))",
                            opacity: 0.05,
                          }}
                          content={<ChartTooltipContent />}
                        />
                        <Bar
                          dataKey="revenue"
                          name={chartProjected}
                          radius={[6, 6, 0, 0]}
                          barSize={60}
                        >
                          <LabelList
                            dataKey="revenue"
                            position="top"
                            offset={10}
                            formatter={formatShortCurrency}
                            className="fill-muted-foreground font-mono text-[10px]"
                          />
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="pt-6 border-t border-muted dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">
                      {currentMonthlyRevenue}
                    </span>
                    <span className="font-mono shrink-0">
                      {formatCurrency(currentRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mt-3 gap-2">
                    <span className="text-muted-foreground">
                      {projectedMonthlyRevenue}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="font-mono font-bold text-sm sm:text-base md:text-lg">
                        {formatCurrency(projectedRevenue)}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 border-primary/50 text-primary bg-primary/10 shrink-0"
                      >
                        +
                        {(
                          (projectedRevenue / currentRevenue - 1) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mt-12 text-center"
        >
          <div className="bg-muted/30 dark:bg-zinc-900/50 border border-muted dark:border-zinc-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground italic">
              {disclaimer}
            </p>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
