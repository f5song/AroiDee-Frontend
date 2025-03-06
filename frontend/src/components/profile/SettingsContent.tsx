import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  Lock, 
  Mail, 
  Save, 
  Shield, 
  Download, 
  Edit, 
  ExternalLink,
  Info,
  User,
  Settings
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Profile } from "./ProfileTypes";
import { toast } from "sonner";

interface SettingsContentProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  isEditable: boolean;
  setIsEditable: (editable: boolean) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  profile,
  setProfile,
  isEditable,
  setIsEditable
}) => {
  const [activeTab, setActiveTab] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Initialize preferences if not defined
  if (!profile.preferences) {
    profile.preferences = {
      language: "en",
      units: "metric",
      darkMode: false,
      emailNotifications: true,
      pushNotifications: true,
      newsletterSubscribed: false
    };
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success({
        title: "Settings Saved",
        description: "Your settings have been successfully updated",
      });
      
      setIsEditable(false);
    } catch (error) {
      toast.error({
        title: "Error",
        description: "Unable to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error({
        title: "Passwords Don't Match",
        description: "New password and confirmation do not match",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error({
        title: "Password Too Short",
        description: "Password should be at least 8 characters long",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success({
        title: "Password Changed",
        description: "Your password has been successfully updated",
      });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error({
        title: "Error",
        description: "Unable to change password. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDarkMode = (enabled: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences!,
        darkMode: enabled
      }
    });
    
    // In a real app, this would update the app theme
  };

  const handleToggleEmailNotifications = (enabled: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences!,
        emailNotifications: enabled
      }
    });
  };

  const handleTogglePushNotifications = (enabled: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences!,
        pushNotifications: enabled
      }
    });
  };

  const handleToggleNewsletter = (enabled: boolean) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences!,
        newsletterSubscribed: enabled
      }
    });
  };

  const handleExportData = () => {
    // Create JSON for download
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `profile-data-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success({
      title: "Data Export Successful",
      description: "Your profile data has been downloaded",
    });
  };

  // Account settings content
  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Account Information</h3>
        <p className="text-sm text-gray-500 mb-4">
          Edit your account information and password
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
            <Input 
              id="username" 
              value={profile.username}
              disabled={true} // Username cannot be changed
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditable}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Change Password</h3>
        <p className="text-sm text-gray-500 mb-4">
          Update your password for better security
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
            <Input 
              id="current-password" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!isEditable}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
            <Input 
              id="new-password" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isEditable}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Password should be at least 8 characters long</p>
          </div>
          
          <div>
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditable}
              className="mt-1"
            />
          </div>
          
          {isEditable && (
            <Button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword || isSaving}
              className="mt-2"
            >
              {isSaving ? "Saving..." : "Change Password"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Notification settings content
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Notifications</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose which notifications you'd like to receive
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs text-gray-500">Receive notifications and updates via email</p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={profile.preferences?.emailNotifications || false}
              onCheckedChange={handleToggleEmailNotifications}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
              <p className="text-xs text-gray-500">Receive notifications when new content is available</p>
            </div>
            <Switch 
              id="push-notifications" 
              checked={profile.preferences?.pushNotifications || false}
              onCheckedChange={handleTogglePushNotifications}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletter" className="text-sm font-medium">Newsletter</Label>
              <p className="text-xs text-gray-500">Receive tips, updates, and new recipes via email</p>
            </div>
            <Switch 
              id="newsletter" 
              checked={profile.preferences?.newsletterSubscribed || false}
              onCheckedChange={handleToggleNewsletter}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Notification Types</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select what types of information you'd like to be notified about
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="recipe-notifications" className="text-sm font-medium">New Recipes</Label>
              <p className="text-xs text-gray-500">Get notified when new recipes matching your preferences are available</p>
            </div>
            <Switch 
              id="recipe-notifications" 
              checked={true}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="calorie-notifications" className="text-sm font-medium">Calorie Alerts</Label>
              <p className="text-xs text-gray-500">Get notified when you're approaching your daily calorie goal</p>
            </div>
            <Switch 
              id="calorie-notifications" 
              checked={true}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reminder-notifications" className="text-sm font-medium">Reminders</Label>
              <p className="text-xs text-gray-500">Get notifications to track your meals and exercise</p>
            </div>
            <Switch 
              id="reminder-notifications" 
              checked={false}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Preference settings content
  const renderPreferenceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Theme and Language</h3>
        <p className="text-sm text-gray-500 mb-4">
          Customize the app theme and language
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="language" className="text-sm font-medium">Language</Label>
            <Select
              disabled={!isEditable}
              value={profile.preferences?.language}
              onValueChange={(value) => setProfile({
                ...profile, 
                preferences: {
                  ...profile.preferences!,
                  language: value as "th" | "en"
                }
              })}
            >
              <SelectTrigger id="language" className="mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="th">Thai</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="theme" className="text-sm font-medium">Theme</Label>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="light-theme" 
                  name="theme" 
                  className="w-4 h-4"
                  checked={!profile.preferences?.darkMode}
                  onChange={() => handleToggleDarkMode(false)}
                  disabled={!isEditable}
                />
                <Label htmlFor="light-theme" className="text-sm flex items-center">
                  <Sun className="w-4 h-4 mr-1" /> Light
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="dark-theme" 
                  name="theme" 
                  className="w-4 h-4"
                  checked={profile.preferences?.darkMode}
                  onChange={() => handleToggleDarkMode(true)}
                  disabled={!isEditable}
                />
                <Label htmlFor="dark-theme" className="text-sm flex items-center">
                  <Moon className="w-4 h-4 mr-1" /> Dark
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Measurement Units</h3>
        <p className="text-sm text-gray-500 mb-4">
          Set your preferred units of measurement
        </p>
        
        <div>
          <Label htmlFor="units" className="text-sm font-medium">Unit System</Label>
          <Select
            disabled={!isEditable}
            value={profile.preferences?.units}
            onValueChange={(value) => setProfile({
              ...profile, 
              preferences: {
                ...profile.preferences!,
                units: value as "metric" | "imperial"
              }
            })}
          >
            <SelectTrigger id="units" className="mt-1">
              <SelectValue placeholder="Select unit system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kilograms, centimeters)</SelectItem>
              <SelectItem value="imperial">Imperial (pounds, inches)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Privacy settings content
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Data Access</h3>
        <p className="text-sm text-gray-500 mb-4">
          Manage your data access and privacy settings
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-profile" className="text-sm font-medium">Public Profile</Label>
              <p className="text-xs text-gray-500">Allow other users to see your profile</p>
            </div>
            <Switch 
              id="public-profile" 
              checked={false}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-activity" className="text-sm font-medium">Show Activity</Label>
              <p className="text-xs text-gray-500">Show your recent activity to other users</p>
            </div>
            <Switch 
              id="show-activity" 
              checked={false}
              disabled={!isEditable}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics" className="text-sm font-medium">Analytics</Label>
              <p className="text-xs text-gray-500">Allow data collection to improve our services</p>
            </div>
            <Switch 
              id="analytics" 
              checked={true}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Data and Backup</h3>
        <p className="text-sm text-gray-500 mb-4">
          Manage data export and backup options
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Export Data</h4>
                <p className="text-xs text-gray-500 mt-1">Download a copy of all your data</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Privacy Policy</h4>
                <p className="text-xs text-gray-500 mt-1">Read our privacy policy</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                asChild
              >
                <a href="/privacy" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-1" /> Read
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" /> Account Settings
            </CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </div>
          
          {!isEditable ? (
            <Button
              variant="outline"
              onClick={() => setIsEditable(true)}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          ) : (
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Preferences
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Privacy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            {renderAccountSettings()}
          </TabsContent>
          
          <TabsContent value="notifications">
            {renderNotificationSettings()}
          </TabsContent>
          
          <TabsContent value="preferences">
            {renderPreferenceSettings()}
          </TabsContent>
          
          <TabsContent value="privacy">
            {renderPrivacySettings()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between text-sm text-gray-500">
        <p>Member since: January 1, 2023</p>
        <p className="flex items-center">
          <Info className="h-4 w-4 mr-1" /> App version: 1.0.0
        </p>
      </CardFooter>
    </Card>
  );
};

export default SettingsContent;