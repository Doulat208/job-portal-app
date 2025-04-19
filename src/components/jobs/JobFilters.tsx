
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
}

interface FilterState {
  jobTypes: string[];
  experience: string[];
  salary: string[];
  remote: boolean;
}

const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    jobTypes: [],
    experience: [],
    salary: [],
    remote: false,
  });
  
  const handleCheckboxChange = (category: string, value: string) => {
    setFilters(prev => {
      let updated: FilterState = { ...prev };
      
      if (category === 'remote') {
        updated.remote = !prev.remote;
      } else {
        const categoryArray = [...prev[category as keyof Omit<FilterState, 'remote'>]] as string[];
        
        if (categoryArray.includes(value)) {
          updated[category as keyof Omit<FilterState, 'remote'>] = categoryArray.filter(item => item !== value) as any;
        } else {
          updated[category as keyof Omit<FilterState, 'remote'>] = [...categoryArray, value] as any;
        }
      }
      
      onFilterChange(updated);
      return updated;
    });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
      
      <Accordion type="multiple" defaultValue={["jobType", "experience", "salary"]}>
        <AccordionItem value="jobType">
          <AccordionTrigger className="text-sm font-medium">Job Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Full-time", "Part-time", "Contract", "Internship", "Temporary"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`job-type-${type}`}
                    checked={filters.jobTypes.includes(type)}
                    onCheckedChange={() => handleCheckboxChange('jobTypes', type)}
                  />
                  <Label htmlFor={`job-type-${type}`} className="text-sm">{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="experience">
          <AccordionTrigger className="text-sm font-medium">Experience Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Entry level", "Mid level", "Senior level", "Director", "Executive"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`exp-${level}`}
                    checked={filters.experience.includes(level)}
                    onCheckedChange={() => handleCheckboxChange('experience', level)}
                  />
                  <Label htmlFor={`exp-${level}`} className="text-sm">{level}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="salary">
          <AccordionTrigger className="text-sm font-medium">Salary Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                "Below $40,000",
                "$40,000 - $60,000",
                "$60,000 - $80,000",
                "$80,000 - $100,000",
                "Above $100,000",
              ].map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`salary-${range}`}
                    checked={filters.salary.includes(range)}
                    onCheckedChange={() => handleCheckboxChange('salary', range)}
                  />
                  <Label htmlFor={`salary-${range}`} className="text-sm">{range}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remote-only" 
            checked={filters.remote}
            onCheckedChange={() => handleCheckboxChange('remote', 'true')}
          />
          <Label htmlFor="remote-only" className="font-medium text-sm">Remote jobs only</Label>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4"
        onClick={() => {
          setFilters({
            jobTypes: [],
            experience: [],
            salary: [],
            remote: false,
          });
          onFilterChange({
            jobTypes: [],
            experience: [],
            salary: [],
            remote: false,
          });
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default JobFilters;
