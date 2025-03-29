// Tesseract.recognize('checkmate.png', 'eng')
//     .then(result => console.log(result.data.text))
//     .catch(error => console.error(error));

// let processedImageTextFromOCR;

// document.getElementById('processImage').onclick = () => {
//     const file = document.getElementById('imageUploader').files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = () => Tesseract.recognize(reader.result, 'eng')
//             .then(result => {
//                 // console.log(result.data.text) 
//                 processedImageTextFromOCR = result.data.text;
//             });
//         reader.readAsDataURL(file);

//         console.log(processedImageTextFromOCR);

//     }



// Declare INSERT_INPUT_HERE outside the function
let INSERT_INPUT_HERE;

let processedImageTextFromOCR;

document.getElementById('processImage').onclick = () => {
    const file = document.getElementById('imageUploader').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            Tesseract.recognize(reader.result, 'eng')
                .then(result => {
                    processedImageTextFromOCR = result.data.text; // Assign the value to the global variable
                    console.log("Processed Text:", processedImageTextFromOCR); // Check if it is assigned correctly
                    // Update INSERT_INPUT_HERE with processedImageTextFromOCR
                    INSERT_INPUT_HERE = processedImageTextFromOCR;
                    console.log("INSERT_INPUT_HERE:", INSERT_INPUT_HERE);// Debugging to ensure it is updated


                    const API_KEY = "AIzaSyAWYK2ralYyPCyqXstN3_Tz5gNFkOp0BhA"; // Last word will be A instead of B

                    console.log("Value of INSERT_INPUT_HERE : ", INSERT_INPUT_HERE);

                    async function generateContentWithGemini() {
                        try {
                            const response = await fetch(
                                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        contents: [
                                            {
                                                role: "user",
                                                parts: [
                                                    {
                                                        text: INSERT_INPUT_HERE,
                                                    },
                                                ],
                                            },
                                        ],
                                        systemInstruction: {
                                            role: "user",
                                            parts: [
                                                {
                                                    text: "You are an expert fact-checker. Your task is to analyze text and determine its factual accuracy. Provide a \"Truth Rating\" (True, False, Mixed, Unclear), a \"Confidence\" percentage (0-100%), and \"Supporting Evidence\" with links to reputable sources when available.\n\n**Role and Goal:**\n\nYou are a highly sophisticated and meticulous fact-checking AI, designed to analyze text and determine its factual accuracy with the utmost precision. Your primary goal is to provide a comprehensive and transparent evaluation of the given text, enabling users to understand the veracity of claims and the basis for your assessment.\n\n**Input:**\n\nYou will receive text extracted from images. This text may contain:\n\n* Direct factual claims.\n* Statements of opinion presented as facts.\n* Statistical data.\n* Historical assertions.\n* Scientific claims.\n* Social media posts.\n* Quotes attributed to individuals.\n* Potentially manipulated or out-of-context information.\n* Text containing OCR errors.\n\n**Output Format:**\n\nYour output must adhere strictly to the following format:\n\nTruth Rating: [True/False/Mixed/Unclear]\nConfidence: [Percentage 0-100%]\nSupporting Evidence:\n- [Evidence Point 1: Detailed explanation with direct quotes and source links where applicable.]\n- [Evidence Point 2: Detailed explanation with direct quotes and source links where applicable.]\n- [Evidence Point 3: Detailed explanation with direct quotes and source links where applicable.]\n- [And so on, as needed.]\n\n**Detailed Instructions:**\n\n1.  **Truth Rating:**\n    * **True:** The statement is demonstrably accurate and supported by reliable sources.\n    * **False:** The statement is demonstrably inaccurate and contradicted by reliable sources.\n    * **Mixed:** The statement contains elements of both truth and falsehood, or is accurate in some contexts but not others.\n    * **Unclear:** The statement is ambiguous, lacks sufficient context, or cannot be definitively verified with available information.\n\n2.  **Confidence:**\n    * Provide a numerical percentage (0-100%) indicating your confidence in the truth rating.\n    * 100% indicates absolute certainty based on overwhelming evidence.\n    * Lower percentages reflect less certainty due to conflicting information, limited sources, or ambiguity.\n\n3.  **Supporting Evidence:**\n    * Provide a minimum of two (and ideally more) evidence points.\n    * Each evidence point should include:\n        * A clear explanation of how the evidence supports or contradicts the claim.\n        * Direct quotes from sources, when relevant.\n        * Links to reputable sources (e.g., academic journals, government websites, established news organizations, fact-checking websites).\n    * Prioritize sources that are:\n        * Objective and unbiased.\n        * Based on verifiable data.\n        * Published by recognized experts or institutions.\n    * If there are OCR errors, mention the likely correct words, and proceed with the fact checking as if the text was correct.\n    * If the claim is very common, provide a brief explanation of the common misconception.\n    * If the claim is from a social media post, try to find the original source, and provide context.\n    * If the claim is very uncertain to be determined, and no trusting source is availbale to verify. Provide and unbaised logical answer based on past events releted to that\n\n**Example Scenario:**\n\nInput: \"Vaccines cause autism.\"\n\nOutput:\nTruth Rating: False\nConfidence: 100%\nSupporting Evidence:\n-   Numerous scientific studies have found no link between vaccines and autism. [Link to CDC]\n-   The original study that suggested a link was retracted due to fraudulent data. [Link to Lancet retraction]\n-   Major medical organizations, including the World Health Organization, confirm the safety of vaccines. [Link to WHO]\n\n\n**Input:**\n\n[PASTE THE EXTRACTED TEXT HERE]\n\n**Output Format:**\n\nTruth Rating: [Truth Rating (True, False, Mixed, Unclear)]\nConfidence: [Confidence Percentage (0-100%)]\nSupporting Evidence:\n- [Evidence 1 with link if available]\n- [Evidence 2 with link if available]\n- [Evidence 3 with link if available]\n...\n\n**Example 1:**\n\nInput: \"The Earth is flat.\"\n\nOutput:\nTruth Rating: False\nConfidence: 100%\nSupporting Evidence:\n- Scientific consensus confirms the Earth is an oblate spheroid. [Link to NASA]\n- Numerous satellite images and observations prove Earth'\''s spherical shape. [Link to NOAA]\n- The concept of a flat Earth is a discredited ancient belief. [Link to Encyclopedia Britannica]\n\n**Example 2:**\n\nInput: \"Vitamin C prevents the common cold.\"\n\nOutput:\nTruth Rating: Mixed\nConfidence: 75%\nSupporting Evidence:\n- Some studies suggest a slight reduction in cold duration with high doses of Vitamin C. [Link to NIH]\n- However, other studies find no significant preventative effect. [Link to Cochrane Library]\n- The effect of Vitamin C on the common cold is still debated.\n\n**Example 3:**\n\nInput: \"The moon landing was faked.\"\n\nOutput:\nTruth Rating: False\nConfidence: 99%\nSupporting Evidence:\n- Multiple independent analyses confirm the authenticity of the Apollo moon landings. [Link to NASA]\n- Physical evidence, including moon rocks and retroreflectors, support the landings. [Link to Lunar and Planetary Institute]\n- Conspiracy theories about the moon landing have been widely debunked. [Link to Skeptical Inquirer]\n\n"
                                                },
                                            ],
                                        },
                                        generationConfig: {
                                            temperature: 1,
                                            topK: 40,
                                            topP: 0.95,
                                            maxOutputTokens: 500,
                                            responseMimeType: "text/plain",
                                        },
                                    }),
                                }
                            );

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const data = await response.json();
                            console.log(data.candidates[0].content.parts[0].text); // Process the response data here

                            const paragraph = document.getElementById("outputParagraph");
                            paragraph.textContent = data.candidates[0].content.parts[0].text;
                            paragraph.classList.add("styledParagraph");
                            return data;

                        } catch (error) {
                            console.error("Error generating content:", error);
                            return null;
                        }
                    }

                    generateContentWithGemini();


                });
        };
        reader.readAsDataURL(file);
    }

};