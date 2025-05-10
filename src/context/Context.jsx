import { createContext, useState, useEffect } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState(sessionStorage.getItem("input") || "");
  const [recentPrompt, setRecentPrompt] = useState(
    sessionStorage.getItem("recentPrompt") || ""
  );
  const [prevPrompts, setPrevPrompts] = useState(() => {
    const stored = sessionStorage.getItem("prevPrompts");
    return stored ? JSON.parse(stored) : [];
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Save to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem("input", input);
    sessionStorage.setItem("recentPrompt", recentPrompt);
    sessionStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
  }, [input, recentPrompt, prevPrompts]);

  const newChat = () => {
    setInput("");
    setResultData("");
    setRecentPrompt("");
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    const finalPrompt = prompt || input;
    if (!finalPrompt.trim()) return;

    // Check if prompt already exists in history
    const existing = prevPrompts.find((item) => item.prompt === finalPrompt);

    if (existing) {
      setRecentPrompt(existing.prompt);
      setResultData(existing.response);
      setShowResult(true);
      return;
    }

    try {
      setLoading(true);
      setRecentPrompt(finalPrompt);
      setResultData("");
      setShowResult(true);

      const response = await run(finalPrompt);

      // Animate word-by-word response
      const wordsArray = response.split(" ");
      wordsArray.forEach((word, i) => {
        setTimeout(() => {
          setResultData((prev) => prev + word + " ");
        }, 30 * i);
      });

      const newEntry = { prompt: finalPrompt, response };
      const updatedHistory = [newEntry, ...prevPrompts].slice(0, 10);
      setPrevPrompts(updatedHistory);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResultData("Error: Unable to fetch response.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
