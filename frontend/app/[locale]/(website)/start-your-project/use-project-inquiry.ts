import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

const SESSION_STORAGE_KEY = "project_inquiry_session";

export function useProjectInquiry() {
  const [isMounted, setIsMounted] = useState(false);
  const [id, setId] = useState<Id<"projectInquiries"> | undefined>(undefined);

  const inquiry = useQuery(
    api.projectInquiries.getInquiry,
    id ? { _id: id } : "skip"
  );

  const saveProgress = useMutation(api.projectInquiries.saveProgress);
  const submitInquiry = useMutation(api.projectInquiries.submitInquiry);

  useEffect(() => {
    setIsMounted(true);

    const init = async () => {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const storedId = storedSession as Id<"projectInquiries">;
        setId(storedId);
      } else {
        const newId = await saveProgress({});
        setId(newId);
      }
    };

    init();
  }, [saveProgress]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(SESSION_STORAGE_KEY, id);
    }
  }, [id]);

  useEffect(() => {
    if (isMounted && id && inquiry === null) {
      const handleMissingDocument = async () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        const newId = await saveProgress({});
        setId(newId);
      };
      handleMissingDocument();
    }
  }, [isMounted, id, inquiry, saveProgress]);

  const updateField = async (
    field: keyof Omit<
      Doc<"projectInquiries">,
      "projectType" | "features" | "existingResources"
    >,
    value: string | boolean
  ) => {
    if (!id) return;
    await saveProgress({
      _id: id,
      [field]: value,
    });
  };

  const handleOptionToggle = async (
    field: keyof Pick<
      Doc<"projectInquiries">,
      "projectType" | "features" | "existingResources"
    >,
    value: string
  ) => {
    if (!inquiry || !id) return;
    const currentValue = inquiry[field] ?? [];
    const isSelected = currentValue.includes(value);
    const updatedValue = isSelected
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];
    await saveProgress({
      _id: id,
      [field]: updatedValue,
    });
  };

  const goToStep = async (step: number) => {
    if (!id) return;
    await saveProgress({
      _id: id,
      currentStep: step,
    });
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return {
    isMounted,
    id,
    inquiry,
    saveProgress,
    submitInquiry,
    updateField,
    handleOptionToggle,
    goToStep,
    clearSession,
  };
}
