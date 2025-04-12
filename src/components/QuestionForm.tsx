import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Lightbulb, Edit, Check, ArrowRight } from 'lucide-react';

// Define the structure for questions with suggested options
interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  description?: string;
  options?: QuestionOption[];
  allowCustom?: boolean;
}

// Enhanced questions with suggestions
const questions: Question[] = [
  { 
    id: 1,
    text: "What subjects do you enjoy the most in school/college?",
    description: "Select the academic areas that genuinely interest you, even if they're not what you're currently studying.",
    options: [
      { id: "math", text: "Mathematics & Statistics" },
      { id: "science", text: "Science (Physics, Chemistry, Biology)" },
      { id: "compsci", text: "Computer Science & Programming" },
      { id: "arts", text: "Arts & Humanities" },
      { id: "social", text: "Social Sciences" },
      { id: "business", text: "Business & Economics" },
      { id: "languages", text: "Languages & Literature" },
    ],
    allowCustom: true,
  },
  { 
    id: 2,
    text: "What are your favorite hobbies or activities outside of academics?",
    description: "These can reveal underlying interests that might translate to career paths.",
    options: [
      { id: "tech", text: "Technology (coding, gaming, electronics)" },
      { id: "creative", text: "Creative pursuits (art, writing, music)" },
      { id: "social", text: "Social activities (organizing events, volunteering)" },
      { id: "physical", text: "Physical activities (sports, fitness, outdoor adventures)" },
      { id: "analytical", text: "Analytical activities (puzzles, chess, strategy games)" },
      { id: "making", text: "Making things (crafts, DIY projects, cooking)" },
    ],
    allowCustom: true,
  },
  { 
    id: 3,
    text: "How do you prefer to solve problems?",
    description: "Your problem-solving approach can indicate suitable work styles and environments.",
    options: [
      { id: "logical", text: "Through logical analysis and systematic thinking" },
      { id: "creative", text: "Using creative and innovative approaches" },
      { id: "collaborative", text: "By discussing with others and gathering perspectives" },
      { id: "experimental", text: "Through trial and error and hands-on experimentation" },
      { id: "research", text: "By researching existing solutions and adapting them" },
    ],
    allowCustom: true,
  },
  { 
    id: 4,
    text: "What kind of work environment do you prefer?",
    description: "Your ideal work setting can help identify careers with matching environments.",
    options: [
      { id: "structured", text: "Structured with clear guidelines and processes" },
      { id: "flexible", text: "Flexible with room for creativity and innovation" },
      { id: "collaborative", text: "Collaborative with strong team interaction" },
      { id: "independent", text: "Independent where I can work autonomously" },
      { id: "dynamic", text: "Fast-paced and constantly changing" },
      { id: "remote", text: "Remote or location-independent" },
    ],
    allowCustom: true,
  },
  { 
    id: 5,
    text: "What skills do you think you excel at?",
    description: "Consider both technical and soft skills you've developed.",
    options: [
      { id: "communication", text: "Communication (writing, speaking, presenting)" },
      { id: "technical", text: "Technical skills (coding, data analysis, engineering)" },
      { id: "creative", text: "Creative skills (design, writing, problem-solving)" },
      { id: "analytical", text: "Analytical thinking and research" },
      { id: "leadership", text: "Leadership and management" },
      { id: "interpersonal", text: "Interpersonal skills and emotional intelligence" },
      { id: "organizational", text: "Organization and attention to detail" },
    ],
    allowCustom: true,
  },
  { 
    id: 6,
    text: "What type of tasks energize you the most?",
    description: "Activities that energize rather than drain you are important career indicators.",
    options: [
      { id: "mental", text: "Mental challenges and problem-solving" },
      { id: "creative", text: "Creative expression and innovation" },
      { id: "helping", text: "Helping or teaching others" },
      { id: "technical", text: "Building or making tangible things" },
      { id: "organizing", text: "Organizing and creating systems" },
      { id: "analyzing", text: "Analyzing data and finding patterns" },
      { id: "leading", text: "Leading teams and initiatives" },
    ],
    allowCustom: true,
  },
  { 
    id: 7,
    text: "How do you handle stress and pressure?",
    description: "Different careers have different stress profiles - knowing your coping style helps find suitable matches.",
    options: [
      { id: "thrive", text: "I thrive under pressure and tight deadlines" },
      { id: "methodical", text: "I handle stress by breaking tasks into manageable steps" },
      { id: "balance", text: "I need balance and prefer moderate, consistent workloads" },
      { id: "adaptive", text: "I'm adaptable but prefer to avoid consistently high-stress environments" },
      { id: "collaborative", text: "I manage stress best when I can collaborate with others" },
    ],
    allowCustom: true,
  },
  { 
    id: 8,
    text: "What are your long-term career goals?",
    description: "Consider what you want to achieve in your professional life.",
    options: [
      { id: "expert", text: "Becoming an expert/authority in my field" },
      { id: "leadership", text: "Reaching leadership or management positions" },
      { id: "entrepreneurship", text: "Starting my own business or working independently" },
      { id: "impact", text: "Making a positive impact on society" },
      { id: "worklife", text: "Achieving good work-life balance" },
      { id: "creativity", text: "Expressing creativity and innovation" },
      { id: "financial", text: "Financial success and stability" },
    ],
    allowCustom: true,
  },
  { 
    id: 9,
    text: "What industries interest you the most?",
    description: "You might find your ideal role in an industry you're naturally drawn to.",
    options: [
      { id: "tech", text: "Technology and Software" },
      { id: "health", text: "Healthcare and Medicine" },
      { id: "education", text: "Education and Training" },
      { id: "finance", text: "Finance and Business" },
      { id: "creative", text: "Creative Arts and Media" },
      { id: "science", text: "Science and Research" },
      { id: "environment", text: "Environmental and Sustainability" },
      { id: "government", text: "Government and Public Service" },
    ],
    allowCustom: true,
  },
  { 
    id: 10,
    text: "What's your preferred way of learning new things?",
    description: "Your learning style can indicate training approaches and career paths that might suit you best.",
    options: [
      { id: "handson", text: "Hands-on practice and experimentation" },
      { id: "visual", text: "Visual learning through demonstrations and diagrams" },
      { id: "reading", text: "Reading and self-study" },
      { id: "discussion", text: "Discussion and collaborative learning" },
      { id: "structured", text: "Structured courses and formal education" },
      { id: "mentorship", text: "One-on-one mentorship and coaching" },
    ],
    allowCustom: true,
  },
];

export default function QuestionForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  const handleNext = () => {
    // Prepare answer data
    let answerData: any;
    
    if (selectedOptions.length > 0 || customAnswer.trim()) {
      // Combine selected options and custom answer
      const selectedTexts = selectedOptions.map(optionId => 
        questions[currentQuestion].options?.find(opt => opt.id === optionId)?.text
      ).filter(Boolean);
      
      if (customAnswer.trim()) {
        answerData = [...selectedTexts, customAnswer.trim()];
      } else {
        answerData = selectedTexts;
      }
    } else {
      // Don't proceed if no answer is provided
      return;
    }
    
    // Save answer
    setAnswers({ ...answers, [questions[currentQuestion].id]: answerData });
    
    // Reset for next question
    setSelectedOptions([]);
    setCustomAnswer('');
    setShowCustomInput(false);
    
    if (currentQuestion === questions.length - 1) {
      // Submit form
      setIsSubmitting(true);
      navigate('/results', { state: { answers: { ...answers, [questions[currentQuestion].id]: answerData } } });
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      
      // Restore previous answers for this question
      const prevAnswers = answers[questions[currentQuestion - 1].id];
      if (Array.isArray(prevAnswers)) {
        // Find matching option IDs
        const options = questions[currentQuestion - 1].options || [];
        const prevSelectedOptions = options
          .filter(option => prevAnswers.includes(option.text))
          .map(option => option.id);
        
        setSelectedOptions(prevSelectedOptions);
        
        // Find custom answer if any
        const customAnswers = prevAnswers.filter(answer => 
          !options.some(option => option.text === answer)
        );
        
        if (customAnswers.length > 0) {
          setCustomAnswer(customAnswers[0]);
          setShowCustomInput(true);
        } else {
          setCustomAnswer('');
          setShowCustomInput(false);
        }
      }
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const hasValidAnswer = selectedOptions.length > 0 || customAnswer.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Career Path Finder</h1>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-sm text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete
              </p>
            </div>
          </div>

          {/* Question card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {currentQuestionData.text}
            </h2>
            {currentQuestionData.description && (
              <p className="text-gray-600 mb-4 flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{currentQuestionData.description}</span>
              </p>
            )}

            {/* Options */}
            {currentQuestionData.options && (
              <div className="space-y-3 mt-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionToggle(option.id)}
                    className={`w-full text-left p-3 rounded-lg border flex items-center transition-all ${
                      selectedOptions.includes(option.id)
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-5 h-5 mr-3 rounded border flex items-center justify-center ${
                      selectedOptions.includes(option.id)
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-400'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {option.text}
                  </button>
                ))}

                {/* Custom option toggle */}
                {currentQuestionData.allowCustom && (
                  <div>
                    <button
                      onClick={() => setShowCustomInput(!showCustomInput)}
                      className={`w-full text-left p-3 rounded-lg border flex items-center transition-all ${
                        showCustomInput || customAnswer
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-5 h-5 mr-3 rounded border flex items-center justify-center ${
                        showCustomInput || customAnswer
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-gray-400'
                      }`}>
                        {(showCustomInput || customAnswer) && (
                          <Edit className="w-3 h-3 text-white" />
                        )}
                      </div>
                      Add your own answer
                    </button>
                    
                    {showCustomInput && (
                      <div className="mt-3 pl-8">
                        <textarea
                          value={customAnswer}
                          onChange={(e) => setCustomAnswer(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          rows={3}
                          placeholder="Type your custom answer here..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 flex items-center transition ${
                currentQuestion === 0 ? 'invisible' : ''
              }`}
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!hasValidAnswer || isSubmitting}
              className={`px-6 py-3 rounded-lg flex items-center font-medium transition ${
                hasValidAnswer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                <>
                  Submit
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Testimonials/Quote Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <p className="text-gray-600 italic">
            "Finding your ideal career path is a journey of self-discovery. Each question helps us understand your unique 
            strengths and preferences to recommend careers where you'll truly thrive."
          </p>
          <p className="text-gray-700 font-medium mt-2">— Career Path Finder AI</p>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Your answers are processed securely to generate personalized career recommendations.</p>
          <p className="mt-1">Take your time to reflect on each question for the most accurate results.</p>
        </div>
      </div>
    </div>
  );
}