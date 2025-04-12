import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, Download, Clock } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Career } from '../types';
import html2pdf from 'html2pdf.js';

// Enhanced Career type with detailed roadmap
interface DetailedRoadmapItem {
  step: string;
  timeEstimate: string;
  resources?: string[];
}

interface DetailedCareer extends Career {
  detailedRoadmap?: {
    beginner: DetailedRoadmapItem[];
    intermediate: DetailedRoadmapItem[];
    expert: DetailedRoadmapItem[];
  };
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<DetailedCareer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingDetailedRoadmap, setGeneratingDetailedRoadmap] = useState<number | null>(null);

  useEffect(() => {
    const predictCareers = async () => {
      try {
        const genAI = new GoogleGenerativeAI('AIzaSyB7xcqS4qBWYH3E38TTOrwJmS3b9tX8ILg'); // Replace with your API key
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const answers = location.state?.answers;
        if (!answers) {
          navigate('/');
          return;
        }

        const prompt = `You are an expert career counselor with 20+ years of experience matching people to careers they'll love and excel at.

        Based on the following personal assessment answers, recommend the 5 most suitable career paths for this specific individual. Consider their unique preferences, skills, personality traits, and values indicated in their answers.
        
        For each career path, provide:
        1. A personalized title that matches their profile
        2. A compelling description explaining why this career would be a good fit for them specifically
        3. A detailed, actionable roadmap divided into three phases:
           - Beginner: First steps they should take to enter this field
           - Intermediate: How to advance and gain expertise
           - Expert: How to reach mastery and leadership in this domain
        
        Return ONLY a JSON object with this exact structure, no markdown or code blocks:
        {
          "careers": [
            {
              "title": "Career Title",
              "description": "Personalized description explaining why this career matches their profile",
              "roadmap": {
                "beginner": ["Specific step 1", "Specific step 2", "Specific step 3"], 
                "intermediate": ["Specific step 1", "Specific step 2", "Specific step 3"],
                "expert": ["Specific step 1", "Specific step 2", "Specific step 3"]
              }
            }
          ]
        }
        
        Here are the individual's assessment answers to analyze in depth: ${JSON.stringify(answers)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Remove any markdown code block indicators and find the JSON object
        const jsonStr = text.replace(/```json\n|\n```/g, '').trim();
        const predictions = JSON.parse(jsonStr);

        if (!predictions.careers || !Array.isArray(predictions.careers)) {
          throw new Error('Invalid response format from AI');
        }

        setCareers(predictions.careers);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error predicting careers:', error);
        setError('Failed to generate career predictions. Please try again.');
        setLoading(false);
      }
    };

    predictCareers();
  }, [location.state, navigate]);

  const generateDetailedRoadmap = async (careerIndex: number) => {
    try {
      setGeneratingDetailedRoadmap(careerIndex);
      const career = careers[careerIndex];
      
      const genAI = new GoogleGenerativeAI('AIzaSyB7xcqS4qBWYH3E38TTOrwJmS3b9tX8ILg');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Create a detailed learning roadmap for someone pursuing a career in "${career.title}".
      
      For each step in the beginner, intermediate, and expert phases, provide:
      1. A specific, actionable task or milestone
      2. An estimated time commitment (e.g., "2 weeks", "3-6 months")
      3. Optional: 1-2 recommended resources (books, courses, etc.)
      
      Return ONLY a JSON object with this exact structure, no markdown or code blocks:
      {
        "detailedRoadmap": {
          "beginner": [
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] },
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] }
          ],
          "intermediate": [
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] },
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] }
          ],
          "expert": [
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] },
            { "step": "Step description", "timeEstimate": "Time estimate", "resources": ["Resource 1", "Resource 2"] }
          ]
        }
      }

      Use the following roadmap steps as a starting point, but enhance them with time estimates and resources:
      Beginner: ${JSON.stringify(career.roadmap.beginner)}
      Intermediate: ${JSON.stringify(career.roadmap.intermediate)}
      Expert: ${JSON.stringify(career.roadmap.expert)}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonStr = text.replace(/```json\n|\n```/g, '').trim();
      const detailedRoadmapData = JSON.parse(jsonStr);
      
      // Update the career with the detailed roadmap
      const updatedCareers = [...careers];
      updatedCareers[careerIndex] = {
        ...career,
        detailedRoadmap: detailedRoadmapData.detailedRoadmap
      };
      
      setCareers(updatedCareers);
      setGeneratingDetailedRoadmap(null);
      
    } catch (error) {
      console.error('Error generating detailed roadmap:', error);
      setGeneratingDetailedRoadmap(null);
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById('career-results');
    const opt = {
      margin: 1,
      filename: 'career-roadmap.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-700">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <Brain className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto" id="career-results">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Your Career Predictions</h1>
            </div>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              <Download className="w-5 h-5" />
              Export to PDF
            </button>
          </div>

          <div className="space-y-8">
            {careers.map((career, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {career.title}
                </h2>
                <p className="text-gray-600 mb-6">{career.description}</p>

                <div className="space-y-4">
                  {!career.detailedRoadmap ? (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Beginner Path</h3>
                        <ul className="space-y-2">
                          {career.roadmap.beginner.map((step, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Intermediate Path</h3>
                        <ul className="space-y-2">
                          {career.roadmap.intermediate.map((step, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Expert Path</h3>
                        <ul className="space-y-2">
                          {career.roadmap.expert.map((step, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Beginner Path</h3>
                        <ul className="space-y-4">
                          {career.detailedRoadmap.beginner.map((item, i) => (
                            <li key={i} className="text-gray-600">
                              <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                                <div>
                                  <p className="font-medium">{item.step}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    <span>{item.timeEstimate}</span>
                                  </div>
                                  {item.resources && item.resources.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 font-medium">Recommended resources:</p>
                                      <ul className="list-disc pl-5 text-sm text-gray-500">
                                        {item.resources.map((resource, j) => (
                                          <li key={j}>{resource}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Intermediate Path</h3>
                        <ul className="space-y-4">
                          {career.detailedRoadmap.intermediate.map((item, i) => (
                            <li key={i} className="text-gray-600">
                              <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                                <div>
                                  <p className="font-medium">{item.step}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    <span>{item.timeEstimate}</span>
                                  </div>
                                  {item.resources && item.resources.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 font-medium">Recommended resources:</p>
                                      <ul className="list-disc pl-5 text-sm text-gray-500">
                                        {item.resources.map((resource, j) => (
                                          <li key={j}>{resource}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Expert Path</h3>
                        <ul className="space-y-4">
                          {career.detailedRoadmap.expert.map((item, i) => (
                            <li key={i} className="text-gray-600">
                              <div className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-1" />
                                <div>
                                  <p className="font-medium">{item.step}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    <span>{item.timeEstimate}</span>
                                  </div>
                                  {item.resources && item.resources.length > 0 && (
                                    <div className="mt-1">
                                      <p className="text-sm text-gray-500 font-medium">Recommended resources:</p>
                                      <ul className="list-disc pl-5 text-sm text-gray-500">
                                        {item.resources.map((resource, j) => (
                                          <li key={j}>{resource}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {!career.detailedRoadmap && (
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => generateDetailedRoadmap(index)}
                        disabled={generatingDetailedRoadmap !== null}
                        className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-70"
                      >
                        {generatingDetailedRoadmap === index ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Generating detailed roadmap...</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5" />
                            <span>Generate detailed roadmap with time estimates</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}