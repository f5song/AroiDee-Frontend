import React, { useState, useEffect } from "react";
import { Flame, Calculator, ChevronRight, Save, Edit, Info, ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

// Sample user data
const initialUserData = {
  gender: "male",
  birthdate: "1990-05-15",
  height: 175, // cm
  weight: 70, // kg
  activityLevel: "moderate", // sedentary, light, moderate, active, very_active
  goal: "maintain", // lose_weight, maintain, gain_weight
  calorieGoal: 2200, // calories per day
  macros: {
    carbs: 50, // percentage
    protein: 30, // percentage
    fat: 20, // percentage
  }
};

const ProfileCalorieGoals = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [activeTab, setActiveTab] = useState("manual");
  
  // Calculate BMR (Basal Metabolic Rate) using Harris-Benedict formula
  const calculateBMR = () => {
    const age = new Date().getFullYear() - new Date(userData.birthdate).getFullYear();
    let bmr = 0;
    
    if (userData.gender === "male") {
      bmr = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * age);
    }
    
    return Math.round(bmr);
  };
  
  // Calculate daily calories based on activity level and goal
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    let activityMultiplier = 1.2; // sedentary
    
    switch (userData.activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "very_active":
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    let tdee = Math.round(bmr * activityMultiplier);
    
    // Adjust based on goal
    if (userData.goal === "lose_weight") {
      tdee -= 500; // deficit of about 500 calories
    } else if (userData.goal === "gain_weight") {
      tdee += 500; // surplus of about 500 calories
    }
    
    return tdee;
  };
  
  // Update calculated calories when user data changes
  useEffect(() => {
    if (activeTab === "calculator") {
      const calculated = calculateTDEE();
      setCalculatedCalories(calculated);
    }
  }, [userData.gender, userData.weight, userData.height, userData.birthdate, userData.activityLevel, userData.goal, activeTab]);

  // Apply calculated calories
  const applyCalculatedCalories = () => {
    setUserData(prev => ({
      ...prev,
      calorieGoal: calculatedCalories
    }));
    setActiveTab("manual");
    toast({
      title: "Calorie Target Updated",
      description: `Calorie goal set to ${calculatedCalories} kcal per day`,
    });
  };
  
  // Save data
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast.success("Settings Saved", {
        description: `Your calorie goal has been set to ${userData.calorieGoal} kcal per day`,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error", {
        description: "Unable to save data. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update macro nutrient ratios
  const updateMacro = (type, value) => {
    if (!isEditing) return;
    
    const newMacros = { ...userData.macros };
    
    if (type === "carbs") {
      const diff = value - newMacros.carbs;
      newMacros.carbs = value;
      
      // Adjust protein and fat proportionally
      const totalOther = newMacros.protein + newMacros.fat;
      if (totalOther > 0) {
        const proteinRatio = newMacros.protein / totalOther;
        const fatRatio = newMacros.fat / totalOther;
        
        newMacros.protein = Math.round(newMacros.protein - (diff * proteinRatio));
        newMacros.fat = 100 - newMacros.carbs - newMacros.protein;
      }
    } else if (type === "protein") {
      const diff = value - newMacros.protein;
      newMacros.protein = value;
      
      // Adjust carbs and fat proportionally
      const totalOther = newMacros.carbs + newMacros.fat;
      if (totalOther > 0) {
        const carbsRatio = newMacros.carbs / totalOther;
        const fatRatio = newMacros.fat / totalOther;
        
        newMacros.carbs = Math.round(newMacros.carbs - (diff * carbsRatio));
        newMacros.fat = 100 - newMacros.carbs - newMacros.protein;
      }
    } else if (type === "fat") {
      const diff = value - newMacros.fat;
      newMacros.fat = value;
      
      // Adjust carbs and protein proportionally
      const totalOther = newMacros.carbs + newMacros.protein;
      if (totalOther > 0) {
        const carbsRatio = newMacros.carbs / totalOther;
        const proteinRatio = newMacros.protein / totalOther;
        
        newMacros.carbs = Math.round(newMacros.carbs - (diff * carbsRatio));
        newMacros.protein = 100 - newMacros.carbs - newMacros.fat;
      }
    }
    
    setUserData({
      ...userData,
      macros: newMacros
    });
  };
  
  // Render calorie summary section
  const renderCalorieSummary = () => {
    return (
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex flex-col items-center text-center">
            <Flame className="h-10 w-10 text-orange-500 mb-2" />
            <h2 className="text-2xl font-bold text-blue-800">{userData.calorieGoal.toLocaleString()} kcal</h2>
            <p className="text-sm font-medium text-blue-600 mb-4">Your Daily Calorie Target</p>
            
            <div className="w-full flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-500">1200</span>
              <Slider
                id="calorieGoalSummary"
                disabled={!isEditing}
                value={[userData.calorieGoal]}
                min={1200}
                max={3500}
                step={50}
                onValueChange={(value) => setUserData({...userData, calorieGoal: value[0]})}
                className="flex-1"
              />
              <span className="text-xs text-gray-500">3500</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-blue-600 text-xs font-bold">{userData.macros.carbs}%</span>
              </div>
              <span className="text-sm font-medium">Carbs</span>
              <span className="text-xs text-gray-500">
                {Math.round(userData.calorieGoal * (userData.macros.carbs/100) / 4)}g
              </span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <span className="text-red-600 text-xs font-bold">{userData.macros.protein}%</span>
              </div>
              <span className="text-sm font-medium">Protein</span>
              <span className="text-xs text-gray-500">
                {Math.round(userData.calorieGoal * (userData.macros.protein/100) / 4)}g
              </span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <span className="text-yellow-600 text-xs font-bold">{userData.macros.fat}%</span>
              </div>
              <span className="text-sm font-medium">Fat</span>
              <span className="text-xs text-gray-500">
                {Math.round(userData.calorieGoal * (userData.macros.fat/100) / 9)}g
              </span>
            </div>
          </div>
          
          {isEditing && (
            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setActiveTab(activeTab === "manual" ? "calculator" : "manual")}
            >
              {activeTab === "manual" ? (
                <>
                  <Calculator className="h-4 w-4 mr-2" /> Calculate from Stats
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 mr-2" /> Back to Manual Settings
                </>
              )}
            </Button>
          )}
        </div>
        
        {activeTab === "calculator" && (
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Calorie Calculator</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base Metabolic Rate (BMR)</span>
                <span className="text-sm">{calculateBMR()} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activity Adjustment</span>
                <span className="text-sm">x{
                  {
                    "sedentary": "1.2",
                    "light": "1.375",
                    "moderate": "1.55", 
                    "active": "1.725",
                    "very_active": "1.9"
                  }[userData.activityLevel]
                }</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Goal Adjustment</span>
                <span className="text-sm">{
                  userData.goal === "lose_weight" ? "-500 kcal" : 
                  userData.goal === "gain_weight" ? "+500 kcal" : 
                  "0 kcal"
                }</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex items-center justify-between font-bold">
                <span className="text-base">Recommended Daily Calories</span>
                <span className="text-lg text-blue-600">{calculatedCalories} kcal</span>
              </div>
            </div>
            
            <Button
              onClick={applyCalculatedCalories}
              disabled={!isEditing}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
            >
              Use This Calculation
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  // Render macro distribution section
  const renderMacroDistribution = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Macronutrient Distribution</h3>
            <p className="text-sm text-gray-500">Balance your nutrients for optimal results</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Macronutrients total 100%. Carbs and protein provide 4 calories per gram, while fat provides 9 calories per gram.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Visual representation of macro distribution */}
        <div className="h-10 flex rounded-lg overflow-hidden mb-6">
          <div 
            className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${userData.macros.carbs}%` }}
          >
            {userData.macros.carbs > 15 ? `${userData.macros.carbs}%` : ''}
          </div>
          <div 
            className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${userData.macros.protein}%` }}
          >
            {userData.macros.protein > 15 ? `${userData.macros.protein}%` : ''}
          </div>
          <div 
            className="bg-yellow-500 flex items-center justify-center text-white text-sm font-medium"
            style={{ width: `${userData.macros.fat}%` }}
          >
            {userData.macros.fat > 15 ? `${userData.macros.fat}%` : ''}
          </div>
        </div>
        
        {/* Macronutrient Sliders */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Carbs */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-blue-700">Carbohydrates</Label>
              <span className="text-sm font-bold text-blue-700">{userData.macros.carbs}%</span>
            </div>
            <Slider
              disabled={!isEditing}
              value={[userData.macros.carbs]}
              min={10}
              max={80}
              step={5}
              onValueChange={(value) => updateMacro("carbs", value[0])}
              className="my-4"
            />
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>10%</span>
              <span>{Math.round(userData.calorieGoal * (userData.macros.carbs/100) / 4)}g total</span>
              <span>80%</span>
            </div>
          </div>
          
          {/* Protein */}
          <div className="space-y-2 p-4 bg-red-50 rounded-lg">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-red-700">Protein</Label>
              <span className="text-sm font-bold text-red-700">{userData.macros.protein}%</span>
            </div>
            <Slider
              disabled={!isEditing}
              value={[userData.macros.protein]}
              min={10}
              max={60}
              step={5}
              onValueChange={(value) => updateMacro("protein", value[0])}
              className="my-4"
            />
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>10%</span>
              <span>{Math.round(userData.calorieGoal * (userData.macros.protein/100) / 4)}g total</span>
              <span>60%</span>
            </div>
          </div>
          
          {/* Fat */}
          <div className="space-y-2 p-4 bg-yellow-50 rounded-lg">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-yellow-700">Fat</Label>
              <span className="text-sm font-bold text-yellow-700">{userData.macros.fat}%</span>
            </div>
            <Slider
              disabled={!isEditing}
              value={[userData.macros.fat]}
              min={10}
              max={60}
              step={5}
              onValueChange={(value) => updateMacro("fat", value[0])}
              className="my-4"
            />
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>10%</span>
              <span>{Math.round(userData.calorieGoal * (userData.macros.fat/100) / 9)}g total</span>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render personal information section
  const renderPersonalInformation = () => {
    if (activeTab !== "calculator") return null;
    
    return (
      <Accordion type="single" collapsible defaultValue="personal-info">
        <AccordionItem value="personal-info" className="border rounded-xl overflow-hidden shadow-sm mb-6">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Your Personal Information</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select
                  disabled={!isEditing}
                  value={userData.gender}
                  onValueChange={(value) => setUserData({...userData, gender: value})}
                >
                  <SelectTrigger id="gender" className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="birthdate" className="text-sm font-medium">Date of Birth</Label>
                <Input
                  id="birthdate"
                  type="date"
                  disabled={!isEditing}
                  value={userData.birthdate}
                  onChange={(e) => setUserData({...userData, birthdate: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  disabled={!isEditing}
                  value={userData.height}
                  onChange={(e) => setUserData({...userData, height: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  disabled={!isEditing}
                  value={userData.weight}
                  onChange={(e) => setUserData({...userData, weight: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  
  // Render activity level section
  const renderActivityLevel = () => {
    if (activeTab !== "calculator") return null;
    
    return (
      <Accordion type="single" collapsible defaultValue="activity-level">
        <AccordionItem value="activity-level" className="border rounded-xl overflow-hidden shadow-sm mb-6">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Activity Level & Goals</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Activity Level</Label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {[
                    { value: "sedentary", label: "Sedentary", description: "Little or no exercise" },
                    { value: "light", label: "Light", description: "Exercise 1-2 times/week" },
                    { value: "moderate", label: "Moderate", description: "Exercise 3-5 times/week" },
                    { value: "active", label: "Very Active", description: "Exercise 6-7 times/week" },
                    { value: "very_active", label: "Extreme", description: "Very hard daily exercise or physical job" }
                  ].map((activity) => (
                    <div 
                      key={activity.value}
                      className={`
                        p-3 rounded-lg border cursor-pointer text-center
                        ${userData.activityLevel === activity.value && isEditing ? 
                          'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                      `}
                      onClick={() => isEditing && setUserData({...userData, activityLevel: activity.value})}
                    >
                      <div className="text-sm font-medium mb-1">{activity.label}</div>
                      <div className="text-xs text-gray-500">{activity.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-3 block">Weight Goal</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div 
                    className={`
                      p-4 rounded-lg border cursor-pointer
                      ${userData.goal === "lose_weight" && isEditing ? 
                        'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => isEditing && setUserData({...userData, goal: "lose_weight"})}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <ArrowDown className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Lose Weight</div>
                      <div className="text-xs text-gray-500">-500 calories/day</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      p-4 rounded-lg border cursor-pointer
                      ${userData.goal === "maintain" && isEditing ? 
                        'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => isEditing && setUserData({...userData, goal: "maintain"})}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <ArrowRight className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Maintain</div>
                      <div className="text-xs text-gray-500">Balanced calories</div>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      p-4 rounded-lg border cursor-pointer
                      ${userData.goal === "gain_weight" && isEditing ? 
                        'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => isEditing && setUserData({...userData, goal: "gain_weight"})}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <ArrowDown className="h-6 w-6 text-red-500 transform rotate-180" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Gain Weight</div>
                      <div className="text-xs text-gray-500">+500 calories/day</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" /> Calorie Goals
          </h2>
          <p className="text-gray-500">Customize your daily nutrition targets</p>
        </div>
        
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Main content */}
      {renderCalorieSummary()}
      {renderPersonalInformation()}
      {renderActivityLevel()}
      {renderMacroDistribution()}
      
      {/* Call-to-action section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready for your Personalized Meal Plan?</h3>
            <p className="text-blue-100">We'll generate meals that match your calorie and macro goals</p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="bg-white text-blue-700 hover:bg-blue-50"
          >
            <a href="/meal-planner">
              Create Meal Plan <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCalorieGoals;