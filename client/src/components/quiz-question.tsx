import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { QuizAnswers } from "@shared/schema";

interface QuestionOption {
  value: string;
  icon: LucideIcon;
  color: string;
  title: string;
  desc: string;
}

interface Question {
  id: number;
  title: string;
  question: string;
  field: keyof QuizAnswers;
  options: QuestionOption[];
}

interface QuizQuestionProps {
  question: Question;
  onAnswer: (field: keyof QuizAnswers, value: string) => void;
  selectedValue?: string;
}

export default function QuizQuestion({ question, onAnswer, selectedValue }: QuizQuestionProps) {
  const handleOptionClick = (value: string) => {
    onAnswer(question.field, value);
  };

  return (
    <div className="grid gap-4" key={question.id}>
      {question.options.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedValue === option.value && selectedValue !== undefined;
        
        return (
          <Button
            key={`${question.id}-${option.value}`}
            variant="outline"
            className={`
              p-4 h-auto border-2 text-left transition-all hover:scale-105
              ${isSelected 
                ? 'border-[hsl(var(--primary-pink))] bg-pink-50' 
                : 'border-gray-200 hover:border-[hsl(var(--primary-pink))] hover:bg-pink-50'
              }
              flex items-center
            `}
            onClick={() => handleOptionClick(option.value)}
            type="button"
            autoFocus={false}
            tabIndex={-1}
          >
            <Icon 
              className={`${option.color} mr-4`}
              size={32}
            />
            <div>
              <div className="font-semibold">{option.title}</div>
              {option.desc && (
                <div className="text-sm text-gray-600">{option.desc}</div>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
