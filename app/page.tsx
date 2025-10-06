"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { calculateBattery, Results } from "@/lib/calculations";

import { Label } from "@/components/ui/label";

type BatteryForm = {
  sideLoadAmp: number;
  desiredBBHrs: number;
  numBatteries: number;
  batteryChargingFactor: number;
  batteryCapacity: number;
  rectifierModule: number;
  cpCapacity: number;
};

export default function HomePage() {
  const [results, setResults] = useState<Results | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BatteryForm>({
    defaultValues: {
      sideLoadAmp: 60,
      desiredBBHrs: 6,
      numBatteries: 1,
      batteryChargingFactor: 0.25,
      batteryCapacity: 100,
      rectifierModule: 1,
      cpCapacity: 1,
    },
  });

  const desiredBBHrs = watch("desiredBBHrs");

  const onSubmit = (data: BatteryForm) => {
    // Convert values to numbers (react-hook-form passes strings by default)
    const parsed: BatteryForm = {
      sideLoadAmp: Number(data.sideLoadAmp),
      desiredBBHrs: Number(data.desiredBBHrs),
      numBatteries: Number(data.numBatteries),
      batteryChargingFactor: Number(data.batteryChargingFactor),
      batteryCapacity: Number(data.batteryCapacity),
      rectifierModule: Number(data.rectifierModule),
      cpCapacity: Number(data.cpCapacity),
    };
    setResults(calculateBattery(parsed));
  };

  // const handleToggleBB = () => {
  //   setValue("desiredBBHrs", desiredBBHrs === 4 ? 6 : 4);
  // };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔋 Site Passive Measurement</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:grid md:grid-cols-2 gap-4"
      >
        <div>
          <Label className="mb-2.5">Side Load Ampere</Label>
          <Input
            type="number"
            {...register("sideLoadAmp", {
              required: "This field is required",
              min: { value: 1, message: "Must be greater than 0" },
              valueAsNumber: true,
            })}
          />
          {errors.sideLoadAmp && (
            <p className="text-red-500 text-sm">{errors.sideLoadAmp.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2.5">Desired BB Hours</Label>
          <Input
            type="number"
            {...register("desiredBBHrs")}
          />
        </div>

        <div>
          <Label className="mb-2.5">Number of Batteries</Label>
          <Input
            type="number"
            {...register("numBatteries", {
              required: "This field is required",
              min: { value: 1, message: "At least 1 battery required" },
              valueAsNumber: true,
            })}
          />
          {errors.numBatteries && (
            <p className="text-red-500 text-sm">{errors.numBatteries.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2.5">Battery Charging Factor</Label>
          <Input
            type="number"
            step="0.01"
            {...register("batteryChargingFactor", {
              required: "This field is required",
              min: { value: 0, message: "Must be ≥ 0" },
              max: { value: 1, message: "Must be ≤ 1" },
              valueAsNumber: true,
            })}
          />
          {errors.batteryChargingFactor && (
            <p className="text-red-500 text-sm">
              {errors.batteryChargingFactor.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-2.5">Battery Capacity (AH)</Label>
          <Input
            type="number"
            {...register("batteryCapacity", {
              required: "This field is required",
              min: { value: 1, message: "Must be greater than 0" },
              valueAsNumber: true,
            })}
          />
          {errors.batteryCapacity && (
            <p className="text-red-500 text-sm">{errors.batteryCapacity.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2.5">Rectifier Module (KW)</Label>
          <Input
            type="number"
            {...register("rectifierModule", {
              required: "This field is required",
              min: { value: 0, message: "Must be ≥ 0" },
              valueAsNumber: true,
            })}
          />
          {errors.rectifierModule && (
            <p className="text-red-500 text-sm">{errors.rectifierModule.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-2.5">CP Capacity (KW)</Label>
          <Input
            type="number"
            {...register("cpCapacity", {
              required: "This field is required",
              min: { value: 0, message: "Must be ≥ 0" },
              valueAsNumber: true,
            })}
          />
          {errors.cpCapacity && (
            <p className="text-red-500 text-sm">{errors.cpCapacity.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Button type="submit" className="mt-4">
            Calculate
          </Button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">📊 Battery Calculation Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter</TableHead>
                <TableHead>Design</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>OK/Not Okay</TableHead>
                <TableHead>Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.parameter}</TableCell>
                  <TableCell>{row.design}</TableCell>
                  <TableCell>{row.actual}</TableCell>
                  {/* <TableCell>{desiredBBHrs}</TableCell> */}
                  <TableCell
                    className={
                      row.ok === "OK"
                        ? "text-green-600 font-semibold"
                        : row.ok === "Not Okay"
                          ? "text-red-600 font-semibold"
                          : ""
                    }
                  >
                    {row.ok}
                  </TableCell>
                  <TableCell>{row.difference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <footer className="mt-32 py-8 text-center  border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Site-passive-measurement</p>
        <div>
          <p className="text-gray-500 text-sm">Developed by <a href="https://moinuddin-portfolio-lime.vercel.app/" className="text-black font-semibold hover:underline hover:underline-offset-4 hover:text-blue-400 hover:font-normal">Md Moinuddin Chowdhury</a></p>
        </div>
      </footer>
    </div>
  );
}
