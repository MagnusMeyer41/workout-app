"use client"

import * as React from "react"
import { Plus, Award, TrendingUp } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BenchmarkDefinition {
  id: string
  name: string
  unit: string
}

interface Benchmark {
  id: string
  value: number
  unit: string | null
  recordedAt: string
  notes: string | null
  benchmarkDefinition: BenchmarkDefinition
}

interface BenchmarksData {
  all: Benchmark[]
  latest: Benchmark[]
}

export default function BenchmarksPage() {
  const [data, setData] = React.useState<BenchmarksData>({ all: [], latest: [] })
  const [definitions, setDefinitions] = React.useState<BenchmarkDefinition[]>([])
  const [loading, setLoading] = React.useState(true)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [form, setForm] = React.useState({ benchmarkDefinitionId: "", value: "", unit: "kg", notes: "" })

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [bRes, dRes] = await Promise.all([
        fetch("/api/benchmarks"),
        fetch("/api/benchmark-definitions"),
      ])
      if (bRes.ok) setData(await bRes.json())
      if (dRes.ok) setDefinitions(await dRes.json())
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    await fetch("/api/benchmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        benchmarkDefinitionId: form.benchmarkDefinitionId,
        value: parseFloat(form.value),
        unit: form.unit,
        notes: form.notes || undefined,
      }),
    })
    setCreateOpen(false)
    setForm({ benchmarkDefinitionId: "", value: "", unit: "kg", notes: "" })
    fetchData()
  }

  const selectedDef = definitions.find((d) => d.id === form.benchmarkDefinitionId)

  return (
    <AppShell role="PLAYER">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Benchmarks</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your personal records and max lifts
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Log Benchmark
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Log New Benchmark</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Benchmark</Label>
                  <Select onValueChange={(v) => setForm({ ...form, benchmarkDefinitionId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select benchmark..." />
                    </SelectTrigger>
                    <SelectContent>
                      {definitions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="0"
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={selectedDef?.unit ?? form.unit}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Input
                    placeholder="e.g. Competition lift, best ever"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleCreate}
                  disabled={!form.benchmarkDefinitionId || !form.value}
                >
                  Save Benchmark
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Latest PRs */}
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Current PRs
            </h2>
            {data.latest.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl mb-8">
                <Award className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No benchmarks logged yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Log your first PR to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {data.latest.map((b) => (
                  <Card key={b.id} className="border-border">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(b.recordedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{b.benchmarkDefinition.name}</p>
                      <p className="text-2xl font-bold text-foreground">
                        {b.value}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{b.unit ?? b.benchmarkDefinition.unit}</span>
                      </p>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">{b.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* History */}
            {data.all.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  History
                </h2>
                <Card className="border-border">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      All Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {data.all.map((b) => (
                        <div key={b.id} className="flex items-center justify-between px-6 py-3">
                          <div>
                            <p className="text-sm font-medium">{b.benchmarkDefinition.name}</p>
                            {b.notes && (
                              <p className="text-xs text-muted-foreground">{b.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">
                              {b.value} {b.unit ?? b.benchmarkDefinition.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(b.recordedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
