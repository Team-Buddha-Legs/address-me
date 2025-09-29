Context:
We are a small Hong Kong based team building a small PoC webapp for demonstrating our ideas. Our idea came from recently released 2025-2026 HK Gov Policy Address. The full document is very long, and even the summarizes from the News is still very long. It's too long for normal HK citizen to read every portion of it, while many parts are unrelavant to themselves.

We want to build a webapp called "AddressMe", which provides tailor-made AI-powered summary of this year's Policy Address to each individual HK citizen. Users will be prompted to enter their own personal profile, such as age, gender, marriage status, district, income range, etc. Then our AI will tailor made a personalized summary for what he/she needs to know about this year's Policy Address.

Main Requirements:
1. User can fill in a form to answer some questions to provide a summary of their personal profile and status. (Questions depends on what we think is relavant when summarizing Policy Address)
2. The app in backend should have a pre-digested content of Policy Address (Assume it's already done one-off). In real-time, the app should use this content, plus user inputted information as context, to generate a summary of "what matters" to the user.
3. The answer should include 1. overall score of policy address to that personale (minimum 70%), 2. relavant points and expandable detail explanations for each areas (e.g. transportation, housing), other major city plan or updates that he should be aware of, although not immediately have impact to him, 4. recommendations for him to get the most out of policy address
4. User can download the result (text or pdf, depends on techincal difficulty to us). User can also re-attempt the process again.

Styling Guide:
- The primary color is professional blue, secondary color is green, and accent color is orange.
- The input section could be a multi-page journey for user to answer one-by-one with good graphic and smooth animation on each page.
- The report page should be 1 page, with toggle on each section (all show at first)
- All pages should be responsive design. Main UI is targeting mobile. Desktop version could be a reasonable scaled or responsive version of the mobile view.

Technical Requirements:
1. Use NextJS 15 for both frontend and backend
2. There is no authentication but do implement applicable measures to enforce security to protect our backend endpoints or server actions
3. Integration with AI should be swappable with different AI. You may pick one at first.
