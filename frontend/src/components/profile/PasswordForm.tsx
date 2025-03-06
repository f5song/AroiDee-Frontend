import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, X, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PasswordFormProps {
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
  isEditing: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onPasswordChange, isEditing }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password validation states
  const [validations, setValidations] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false
  });
  
  // Update validations when password changes
  useEffect(() => {
    setValidations({
      hasMinLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword.length > 0
    });
  }, [newPassword, confirmPassword]);
  
  // Calculate overall password strength
  const getPasswordStrength = () => {
    const { hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = validations;
    const checkedCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
    
    if (checkedCount <= 2) return { strength: "weak", color: "bg-red-500", percentage: 20 };
    if (checkedCount <= 3) return { strength: "fair", color: "bg-yellow-500", percentage: 40 };
    if (checkedCount <= 4) return { strength: "good", color: "bg-blue-500", percentage: 70 };
    return { strength: "strong", color: "bg-green-500", percentage: 100 };
  };
  
  const { strength, color, percentage } = getPasswordStrength();
  
  const handleChangePassword = async () => {
    // Check if all validations pass
    const allValid = Object.values(validations).every(Boolean);
    
    if (!allValid) {
      toast.error({
        title: "Invalid Password",
        description: "Please make sure your password meets all requirements"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await onPasswordChange(currentPassword, newPassword);
      
      // Clear form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success({
        title: "Password Updated",
        description: "Your password has been successfully changed"
      });
    } catch (error) {
      console.error("Failed to change password", error);
      toast.error({
        title: "Update Failed",
        description: "There was an error changing your password. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={isValid ? "text-green-700" : "text-gray-500"}>{text}</span>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-gray-600" /> Change Password
        </CardTitle>
        <CardDescription>
          Update your password to maintain account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Password */}
        <div>
          <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
          <div className="relative mt-1">
            <Input 
              id="current-password" 
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={!isEditing || isSaving}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={!isEditing || isSaving}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {/* New Password */}
        <div>
          <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
          <div className="relative mt-1">
            <Input 
              id="new-password" 
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!isEditing || isSaving}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={!isEditing || isSaving}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* Password strength indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-medium ${
                  strength === 'weak' ? 'text-red-600' : 
                  strength === 'fair' ? 'text-yellow-600' : 
                  strength === 'good' ? 'text-blue-600' : 
                  'text-green-600'
                }`}>
                  {strength}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${color} transition-all duration-300`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Password requirements */}
          {newPassword && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password requirements:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ValidationItem isValid={validations.hasMinLength} text="At least 8 characters" />
                <ValidationItem isValid={validations.hasUppercase} text="At least 1 uppercase letter" />
                <ValidationItem isValid={validations.hasLowercase} text="At least 1 lowercase letter" />
                <ValidationItem isValid={validations.hasNumber} text="At least 1 number" />
                <ValidationItem isValid={validations.hasSpecialChar} text="At least 1 special character" />
              </div>
            </div>
          )}
        </div>
        
        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
          <div className="relative mt-1">
            <Input 
              id="confirm-password" 
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditing || isSaving}
              className={`pr-10 ${
                confirmPassword && !validations.passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={!isEditing || isSaving}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {confirmPassword && !validations.passwordsMatch && (
            <div className="flex items-center gap-1 text-red-500 mt-1 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Passwords do not match</span>
            </div>
          )}
          
          {confirmPassword && validations.passwordsMatch && (
            <div className="flex items-center gap-1 text-green-500 mt-1 text-sm">
              <Check className="h-4 w-4" />
              <span>Passwords match</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isEditing && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      !currentPassword || 
                      !newPassword || 
                      !confirmPassword || 
                      !validations.passwordsMatch ||
                      isSaving
                    }
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!currentPassword || !newPassword || !confirmPassword || !validations.passwordsMatch ? (
                <TooltipContent>
                  <p>Please fill in all password fields correctly</p>
                </TooltipContent>
              ) : null}
            </Tooltip>
          </TooltipProvider>
        )}
      </CardFooter>
    </Card>
  );
};

export default PasswordForm;