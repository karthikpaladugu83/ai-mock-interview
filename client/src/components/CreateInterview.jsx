import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import {
  INTERVIEW_TYPES,
  EXPERIENCE_LEVELS,
  JOB_ROLES,
} from "@/lib/constants";
import {
  Sparkles,
  Loader2,
  ArrowRight,
  ChevronRight,
  FileText,
  Settings,
  Play,
} from "lucide-react";

export default function CreateInterview() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    type: "",
    experience: "",
    jobDescription: "",
    focusArea: "",
    questionCount: "5",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await api.post("/interviews", formData);

      navigate(`/interview/${res.data._id}`);
    } catch (err) {
      console.error("Failed to create interview:", err);
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid =
    formData.role &&
    formData.type &&
    formData.experience;

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Create New Interview
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your AI-powered interview
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>

            {s < 3 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Settings className="w-5 h-5" />
              Basic Configuration
            </CardTitle>

            <CardDescription>
              Tell us about your interview.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            <div>
              <Label>Role</Label>

              <Select
                value={formData.role}
                onValueChange={(v) =>
                  handleChange("role", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>

                <SelectContent>
                  {JOB_ROLES.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                    >
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interview Type</Label>

              <Select
                value={formData.type}
                onValueChange={(v) =>
                  handleChange("type", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>

                <SelectContent>
                  {INTERVIEW_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Experience</Label>

              <Select
                value={formData.experience}
                onValueChange={(v) =>
                  handleChange("experience", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Experience" />
                </SelectTrigger>

                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem
                      key={level.value}
                      value={level.value}
                    >
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
            >
              Next
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Additional Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <Textarea
              placeholder="Job Description"
              value={formData.jobDescription}
              onChange={(e) =>
                handleChange(
                  "jobDescription",
                  e.target.value
                )
              }
            />

            <Separator />

            <Textarea
              placeholder="Focus Areas"
              value={formData.focusArea}
              onChange={(e) =>
                handleChange(
                  "focusArea",
                  e.target.value
                )
              }
            />

            <div className="flex justify-between">

              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>

              <Button
                onClick={() => setStep(3)}
              >
                Review
              </Button>

            </div>

          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>

          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Sparkles className="w-5 h-5" />
              Review
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-2 mb-6">
              <p><strong>Role:</strong> {formData.role}</p>
              <p><strong>Type:</strong> {formData.type}</p>
              <p><strong>Experience:</strong> {formData.experience}</p>
            </div>

            <div className="flex justify-between">

              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                Back
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-4 h-4" />
                    Start Interview
                  </>
                )}
              </Button>

            </div>

          </CardContent>

        </Card>
      )}
    </div>
  );
}