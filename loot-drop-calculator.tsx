"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "next-themes"
import { Plus, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer } from "@/components/ui/chart"

export interface LootItem {
  id: string
  name: string
  rarity: number
  timePerAttempt: number
}

export interface ItemProbability {
  individual: number
  conditional: number
  timeToObtain: number
}

export default function LootDropCalculator() {
  const [attempts, setAttempts] = useState<number>(10)
  const [items, setItems] = useState<LootItem[]>([
    { id: "1", name: "Legendary Sword", rarity: 5, timePerAttempt: 1 },
    { id: "2", name: "Rare Shield", rarity: 10, timePerAttempt: 1 }
  ])
  const [probability, setProbability] = useState<number | null>(null)
  const [attemptsFor100, setAttemptsFor100] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  const calculateProbability = (attempts: number, rarity: number): number => {
    const rarityDecimal = rarity / 100
    const failureProbability = 1 - rarityDecimal
    const totalFailureProbability = Math.pow(failureProbability, attempts)
    return (1 - totalFailureProbability) * 100
  }

  const calculateCombinedProbability = (attempts: number, rarities: number[]): number => {
    const failureProbability = rarities.reduce((acc, rarity) => acc * (1 - rarity / 100), 1)
    return (1 - Math.pow(failureProbability, attempts)) * 100
  }

  const calculateAttemptsFor100 = (rarities: number[]): number => {
    const combinedRarity = 1 - rarities.reduce((acc, rarity) => acc * (1 - rarity / 100), 1)
    return Math.ceil(Math.log(0.0001) / Math.log(1 - combinedRarity))
  }

  const generateChartData = () => {
    const data = []
    for (let i = 1; i <= Math.max(attempts, 10); i++) {
      const point: any = { attempts: i }
      // Add individual item probabilities
      items.forEach(item => {
        point[item.name] = calculateProbability(i, item.rarity)
      })
      // Add combined probability for all items
      point["All Items"] = calculateCombinedProbability(i, items.map(item => item.rarity))
      data.push(point)
    }
    return data
  }

  const chartData = useMemo(() => generateChartData(), [attempts, items])

  const handleCalculate = async () => {
    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const rarities = items.map(item => item.rarity)
    const calculatedProbability = calculateCombinedProbability(attempts, rarities)
    setProbability(calculatedProbability)

    const attemptsNeeded = calculateAttemptsFor100(rarities)
    setAttemptsFor100(attemptsNeeded)

    setIsCalculating(false)
  }

  const addItem = () => {
    const newId = (items.length + 1).toString()
    setItems([...items, { id: newId, name: "", rarity: 1, timePerAttempt: 1 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof LootItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: field === 'rarity' || field === 'timePerAttempt' ? Number(value) : value } : item
    ))
  }

  const totalTime = useMemo(() => {
    if (attemptsFor100 === null) return null
    return items.reduce((total, item) => total + attemptsFor100 * item.timePerAttempt, 0).toFixed(2)
  }, [attemptsFor100, items])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto p-4 space-y-8">
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Advanced Loot Drop Probability Calculator</CardTitle>
                <CardDescription>Calculate probabilities for multiple items and estimate time to obtain</CardDescription>
              </div>
              <ThemeToggle />
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="attempts">Number of Attempts</Label>
                  <Input
                    id="attempts"
                    type="number"
                    value={attempts}
                    onChange={(e) => setAttempts(parseInt(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr,100px,120px,40px] gap-2 items-center">
                    <Label className="px-1">Item Name</Label>
                    <Label className="px-1">Rarity (%)</Label>
                    <Label className="px-1">Minutes/Attempt</Label>
                    <div className="w-10" /> {/* Spacer for delete button column */}
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr,100px,120px,40px] gap-2 items-center">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Rarity %"
                        value={item.rarity}
                        onChange={(e) => updateItem(item.id, 'rarity', e.target.value)}
                        min={0}
                        max={100}
                        step={0.1}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Time per attempt"
                        value={item.timePerAttempt}
                        onChange={(e) => updateItem(item.id, 'timePerAttempt', e.target.value)}
                        min={0.1}
                        step={0.1}
                        required
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
                <Button type="submit" disabled={isCalculating}>
                  {isCalculating ? (
                    <span className="animate-pulse">Calculating...</span>
                  ) : (
                    "Calculate"
                  )}
                </Button>
              </form>

              {probability !== null && attemptsFor100 !== null && (
                <Tabs defaultValue="probability" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="probability">Probability</TabsTrigger>
                    <TabsTrigger value="attempts">Attempts for 100%</TabsTrigger>
                  </TabsList>
                  <TabsContent value="probability" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Result:</h3>
                      <p>
                        The probability of obtaining all items in {attempts} attempts is:
                        <span className="font-bold text-primary"> {probability.toFixed(2)}%</span>
                      </p>
                      <p>
                        Estimated time: <span className="font-bold text-primary">{(attempts * items.reduce((total, item) => total + item.timePerAttempt, 0)).toFixed(2)} minutes</span>
                      </p>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Individual Item Probabilities:</h4>
                        <div className="space-y-1">
                          {items.map(item => (
                            <p key={item.id}>
                              {item.name}: <span className="font-medium">{calculateProbability(attempts, item.rarity).toFixed(2)}%</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Probability Over Attempts:</h3>
                      <div className="w-full h-[400px] bg-background dark:bg-blue-950/20 rounded-lg p-8">
                        <ChartContainer
                          config={{
                            ...items.reduce((acc, item) => ({
                              ...acc,
                              [item.name]: {
                                label: item.name,
                                color: `hsl(${parseInt(item.id) * 60}, 70%, 50%)`,
                              },
                            }), {}),
                            "All Items": {
                              label: "All Items",
                              color: "hsl(var(--foreground))",
                            },
                          }}
                          className="text-foreground dark:text-gray-200"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <XAxis
                                dataKey="attempts"
                                label={{ value: "Number of Attempts", position: "bottom", offset: 10 }}
                                stroke="currentColor"
                              />
                              <YAxis
                                label={{ value: "Probability (%)", angle: -90, position: "left", offset: 20 }}
                                domain={[0, 100]}
                                stroke="currentColor"
                              />
                              <Tooltip
                                content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null;
                                  return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                      <div className="grid gap-2">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium dark:text-gray-200">Attempts</span>
                                          <span className="text-sm text-muted-foreground dark:text-gray-400">
                                            {payload[0].payload.attempts}
                                          </span>
                                        </div>
                                        {payload.map((entry: any) => (
                                          <div key={entry.name} className="flex flex-col">
                                            <span className="text-sm font-medium dark:text-gray-200">{entry.name}</span>
                                            <span className="text-sm text-muted-foreground dark:text-gray-400">
                                              {`${entry.value.toFixed(2)}%`}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }}
                              />
                              {items.map(item => (
                                <Line
                                  key={item.id}
                                  type="monotone"
                                  dataKey={item.name}
                                  stroke={`hsl(${parseInt(item.id) * 60}, 70%, 50%)`}
                                  strokeWidth={2}
                                  dot={false}
                                />
                              ))}
                              <Line
                                type="monotone"
                                dataKey="All Items"
                                stroke="hsl(var(--foreground))"
                                strokeWidth={2.5}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="attempts" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Attempts Needed for 100% Probability:</h3>
                      <p>
                        To reach a 99.99% probability of obtaining all items, you need:
                        <span className="font-bold text-primary"> {attemptsFor100} attempts</span>
                      </p>
                      <p>
                        Estimated time: <span className="font-bold text-primary">{totalTime} minutes</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: We use 99.99% as an approximation for 100% due to the asymptotic nature of probability.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding the math behind the probability calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Multiple Item Probability Calculation</h3>
              <p>
                The probability of obtaining each individual item with a given rarity in a certain number of attempts is calculated using the following formula:
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                P(item) = 1 - (1 - rarity)^attempts
              </pre>
              <p>
                Where <code>rarity</code> is expressed as a decimal (e.g., 5% = 0.05) and <code>attempts</code> is the number of tries.
              </p>
              <p>
                The probability of obtaining all items is calculated as:
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                P(all items) = 1 - (1 - r1) * (1 - r2) * ... * (1 - rn))^attempts
              </pre>
              <p>
                Where <code>r1, r2, ..., rn</code> are the rarities of each item.
              </p>

              <h3 className="text-lg font-semibold mt-6">Time Estimation</h3>
              <p>
                The total time estimation is calculated by multiplying the number of attempts by the time per attempt for each item:
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                Total Time = Sum(Number of Attempts * Time per Attempt for each item)
              </pre>

              <p className="mt-4">
                The calculator uses these formulas to compute probabilities for obtaining items and visualizes how these probabilities change with the number of attempts.
              </p>
            </CardContent>
          </Card>
        </div>
        <footer className="bg-background border-t border-border mt-8 py-4 text-center text-sm text-muted-foreground">
          © 2025 Loot Drop Probability Calculator. All rights reserved.
        </footer>
      </div>
    </ThemeProvider>
  )
}

