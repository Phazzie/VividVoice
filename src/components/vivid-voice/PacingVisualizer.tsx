"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { PacingSegment } from "@/lib/actions";

interface PacingVisualizerProps {
  pacing: {
    segments: PacingSegment[];
  };
}

export function PacingVisualizer({ pacing }: PacingVisualizerProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={pacing.segments}>
        <XAxis
          dataKey="segment"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="dialogue" fill="#8884d8" stackId="a" />
        <Bar dataKey="narration" fill="#82ca9d" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
