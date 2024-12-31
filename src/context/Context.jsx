import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    // Validate input or prompt
    const finalPrompt = prompt || input;
    if (!finalPrompt.trim()) return; // Avoid empty submissions.

    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      // Update recent and previous prompts
      setRecentPrompt(finalPrompt);
      setPrevPrompts((prev) => [...prev, finalPrompt]);

      // Fetch response
      const response = await run(finalPrompt);

      // Format response
      const responseArray = response.split("**");
      let formattedResponse = "";

      responseArray.forEach((chunk, i) => {
        formattedResponse += i % 2 === 1 ? `<b>${chunk}</b>` : chunk;
      });

      formattedResponse = formattedResponse.split("*").join("</br>");
      const wordsArray = formattedResponse.split(" ");

      // Animate response display
      wordsArray.forEach((word, i) => delayPara(i, word + " "));
    } catch (error) {
      console.error("Error fetching response:", error);
      setResultData("Error: Unable to fetch response.");
    } finally {
      setLoading(false);
      setInput(""); // Clear input field
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
