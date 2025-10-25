
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { User, Mail, CreditCard, Image as ImageIcon, GraduationCap, ArrowRight, ArrowLeft, FolderOpen, Code } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddStudentFormData {
  name: string;
  email: string;
  cardUID: string;
  image?: File;
  category: string;
  classLevel: string;
  program?: string;
}

interface AddStudentFormProps {
  onSubmit: (data: AddStudentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, reset, trigger, getValues, setValue } = useForm<AddStudentFormData>();

  const classLevels: Record<string, string[]> = {
    Primary: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    Secondary: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    TSS: ['Level 3', 'Level 4', 'Level 5'],
  };

  const programs = [
    { value: 'Software Development', emoji: '💻' },
    { value: 'Networking', emoji: '🌐' },
    { value: 'Electrical Engineering', emoji: '⚡' },
    { value: 'Automotive Mechanics', emoji: '🚗' },
    { value: 'Construction Technology', emoji: '🏗️' },
    { value: 'Culinary Arts', emoji: '🍳' },
  ];

  const handleNextStep = async () => {
    // Validate current step fields before proceeding
    const isValid = await trigger(['name', 'email', 'cardUID']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: AddStudentFormData) => {
    const formData = {
      ...data,
      category: selectedCategory,
      classLevel: selectedClass,
      program: selectedCategory === 'TSS' ? selectedProgram : undefined,
      image: selectedImage || undefined,
    };
    onSubmit(formData);
    reset();
    setCurrentStep(1);
    setImagePreview(null);
    setSelectedImage(null);
    setSelectedCategory('');
    setSelectedClass('');
    setSelectedProgram('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Add New Student
        </CardTitle>
        <CardDescription>
          Step {currentStep} of 2: {currentStep === 1 ? 'Basic Information' : 'Additional Details'}
        </CardDescription>
        {/* Progress Indicator */}
        <div className="flex gap-2 mt-4">
          <div className={`h-2 flex-1 rounded-full ${
            currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'
          }`} />
          <div className={`h-2 flex-1 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
          }`} />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@university.edu"
                    className="pl-10"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardUID">RFID Card UID</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cardUID"
                    placeholder="RFID123456"
                    className="pl-10"
                    {...register('cardUID', { required: 'Card UID is required' })}
                  />
                </div>
                {errors.cardUID && <p className="text-sm text-red-500">{errors.cardUID.message}</p>}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button type="button" onClick={handleNextStep} className="flex-1">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Additional Details */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="image">Student Image (Optional)</Label>
                <div className="flex flex-col items-center gap-4">
                  {imagePreview && (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative w-full">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="pl-10"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary">Primary</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="TSS">TSS (Technical Secondary School)</SelectItem>
                  </SelectContent>
                </Select>
                {!selectedCategory && <p className="text-sm text-red-500">Category is required</p>}
              </div>

              {selectedCategory && (
                <div className="space-y-2">
                  <Label htmlFor="classLevel">Class Level</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select class level" />
                    </SelectTrigger>
                    <SelectContent>
                      {classLevels[selectedCategory]?.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedClass && <p className="text-sm text-red-500">Class level is required</p>}
                </div>
              )}

              {selectedCategory === 'TSS' && (
                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((prog) => (
                        <SelectItem key={prog.value} value={prog.value}>
                          {prog.emoji} {prog.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!selectedProgram && <p className="text-sm text-red-500">Program is required for TSS</p>}
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Adding...' : 'Add Student'}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStudentForm;
