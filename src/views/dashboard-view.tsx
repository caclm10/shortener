import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { getLinks } from "@/lib/links";
import { cn } from "@/lib/utils";
import { Link2, MousePointerClick, TrendingUp } from "lucide-react";

function DashboardView() {
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalVisits: 0,
        linksThisMonth: 0,
    });
    const [allLinks, setAllLinks] = useState<LinkTable[]>([]);
    const [recentLinks, setRecentLinks] = useState<LinkTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const links = await getLinks();

            // Calculate stats
            const totalLinks = links.length;
            const totalVisits = links.reduce(
                (sum, link) => sum + link.visit_count,
                0,
            );

            // Links created this month
            const now = new Date();
            const thisMonth = links.filter((link) => {
                const created = new Date(link.created_at);
                return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );
            }).length;

            setStats({
                totalLinks,
                totalVisits,
                linksThisMonth: thisMonth,
            });

            // Store all links for chart
            setAllLinks(links);
            // Get recent 5 links for list
            setRecentLinks(links.slice(0, 5));
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Generate chart data aggregated by month (last 6 months)
    const generateChartData = () => {
        const months: { [key: string]: { links: number; visits: number } } = {};
        const now = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
            });
            months[key] = { links: 0, visits: 0 };
        }

        // Aggregate data
        allLinks.forEach((link) => {
            const created = new Date(link.created_at);
            const key = created.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
            });
            if (months[key]) {
                months[key].links += 1;
                months[key].visits += link.visit_count;
            }
        });

        return Object.entries(months).map(([month, data]) => ({
            month,
            links: data.links,
            visits: data.visits,
        }));
    };

    const chartData = generateChartData();

    const chartConfig = {
        links: {
            label: "Links Created",
            color: "var(--chart-1)",
        },
        visits: {
            label: "Total Visits",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig;

    const statCards = [
        {
            icon: Link2,
            iconColor: "text-blue-600",
            title: "Total Links",
            value: stats.totalLinks,
            badge: {
                color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                text: `+${stats.linksThisMonth} this month`,
            },
        },
        {
            icon: MousePointerClick,
            iconColor: "text-green-600",
            title: "Total Visits",
            value: stats.totalVisits,
            badge: {
                color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
                icon: TrendingUp,
                text: "All time",
            },
        },
        {
            icon: TrendingUp,
            iconColor: "text-purple-600",
            title: "Links This Month",
            value: stats.linksThisMonth,
            badge: {
                color: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
                text: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                }),
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-muted-foreground">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your shortened links
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((card, i) => (
                    <Card key={i}>
                        <CardContent className="flex h-full flex-col pt-6">
                            {/* Icon & Badge */}
                            <div className="mb-4 flex items-center justify-between">
                                <card.icon
                                    className={cn("size-6", card.iconColor)}
                                />
                                <Badge
                                    className={cn(
                                        "rounded-full px-2 py-1",
                                        card.badge.color,
                                    )}
                                >
                                    {card.badge.text}
                                </Badge>
                            </div>

                            {/* Value */}
                            <div>
                                <div className="text-muted-foreground mb-1 text-sm font-medium">
                                    {card.title}
                                </div>
                                <div className="text-foreground text-3xl font-bold">
                                    {card.value.toLocaleString()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                        Links created vs visits over the last 6 months
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? (
                        <ChartContainer
                            config={chartConfig}
                            className="h-[300px] w-full"
                        >
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent indicator="dot" />
                                    }
                                />
                                <Area
                                    dataKey="links"
                                    type="natural"
                                    fill="var(--color-links)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-links)"
                                    stackId="a"
                                />
                                <Area
                                    dataKey="visits"
                                    type="natural"
                                    fill="var(--color-visits)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-visits)"
                                    stackId="b"
                                />
                            </AreaChart>
                        </ChartContainer>
                    ) : (
                        <div className="text-muted-foreground flex h-[300px] items-center justify-center">
                            No links yet. Create your first link to see stats.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Links</CardTitle>
                    <CardDescription>
                        Your most recently created short links
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recentLinks.length > 0 ? (
                        <div className="space-y-4">
                            {recentLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex flex-col gap-1">
                                        <code className="text-sm font-medium">
                                            /{link.alias}
                                        </code>
                                        <span className="text-muted-foreground max-w-[300px] truncate text-xs">
                                            {link.original_url}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {link.visit_count} visits
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex h-[100px] items-center justify-center">
                            No links yet. Create your first link!
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export { DashboardView };
