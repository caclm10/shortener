import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";

const cards = [
    {
        icon: Briefcase,
        iconColor: "text-green-600",
        title: "Active Projects",
        badge: {
            color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
            icon: TrendingUp,
            iconColor: "text-green-500",
            text: "+12.8%",
        },
        value: 17,
        dateRange: "From Jan 01 - Jul 30, 2024",
    },
    {
        icon: ShoppingCart,
        iconColor: "text-blue-600",
        title: "Orders Processed",
        badge: {
            color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
            icon: TrendingUp,
            iconColor: "text-blue-500",
            text: "+3.7%",
        },
        value: 3421,
        dateRange: "From Jan 01 - Jul 30, 2024",
    },
    {
        icon: Users,
        iconColor: "text-pink-600",
        title: "Churned Users",
        badge: {
            color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
            icon: TrendingDown,
            iconColor: "text-pink-500",
            text: "-2.1%",
        },
        value: 89,
        dateRange: "From Jan 01 - Jul 30, 2024",
    },
];

export default function StatisticCardExample() {
    return (
        <div className="flex min-h-screen items-center justify-center p-6 lg:p-12">
            {/* Container */}
            <div className="@container w-full grow">
                {/* Grid */}
                <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
                    {/* Cards */}
                    {cards.map((card, i) => (
                        <Card key={i}>
                            <CardContent className="flex h-full flex-col">
                                {/* Title & Badge */}
                                <div className="mb-8 flex items-center justify-between">
                                    <card.icon
                                        className={cn("size-6", card.iconColor)}
                                    />

                                    <Badge
                                        className={cn(
                                            "rounded-full px-2 py-1",
                                            card.badge.color,
                                        )}
                                    >
                                        <card.badge.icon
                                            className={`h-3 w-3 ${card.badge.iconColor}`}
                                        />
                                        {card.badge.text}
                                    </Badge>
                                </div>

                                {/* Value & Date Range */}
                                <div className="flex flex-1 grow flex-col justify-between">
                                    {/* Value */}
                                    <div>
                                        <div className="text-muted-foreground mb-1 text-base font-medium">
                                            {card.title}
                                        </div>
                                        <div className="text-foreground mb-6 text-3xl font-bold">
                                            {card.value.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="border-muted text-muted-foreground border-t pt-3 text-xs font-medium">
                                        {card.dateRange}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
