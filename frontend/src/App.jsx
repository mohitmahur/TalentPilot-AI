// frontend/src/App.jsx

import React, { useState } from "react";
import axios from "axios";

// 🔥 Production Backend URL
const API = "https://talentpilot-backend.onrender.com";

export default function App() {
    const [jd, setJd] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const analyzeJD = async () => {
        if (!jd.trim()) {
            alert("Please enter Job Description");
            return;
        }

        setLoading(true);
        setAnalysis(null);
        setCandidates([]);

        try {
            console.log("Calling analyze API...");

            const res = await axios.post(
                `${API}/jobs/analyze`,
                { description: jd },
                { timeout: 60000 }
            );

            console.log("Analyze Response:", res.data);

            setAnalysis(res.data.analysis);

            console.log("Calling ranked API...");

            const rank = await axios.get(
                `${API}/candidates/ranked`,
                { timeout: 60000 }
            );

            console.log("Rank Response:", rank.data);

            setCandidates(rank.data);

        } catch (error) {
            console.error("API Error:", error);
            alert("Backend is waking up or request failed. Please wait 20 sec and try again.");
        }

        setLoading(false);
    };

    const topCandidate =
        candidates.length > 0 ? candidates[0] : null;

    const confidence = (score) => {
        if (score >= 80) return "High Fit";
        if (score >= 60) return "Medium Fit";
        return "Low Fit";
    };

    const downloadCSV = () => {
        if (!candidates.length) return;

        let csv =
            "Rank,Name,Match Score,Interest Score,Final Score,Reason\n";

        candidates.forEach((c, i) => {
            csv += `${i + 1},${c.name},${c.match_score},${c.interest_score},${c.final_score},${c.reason}\n`;
        });

        const blob = new Blob([csv], {
            type: "text/csv",
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ranked_candidates.csv";
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    TalentPilot AI
                </h1>

                <p className="text-gray-300 mt-2 mb-8">
                    Autonomous Hiring Intelligence Agent
                </p>

                {/* Input */}
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-6">
                    <h2 className="text-xl font-semibold mb-3">
                        Paste Job Description
                    </h2>

                    <textarea
                        value={jd}
                        onChange={(e) =>
                            setJd(e.target.value)
                        }
                        className="w-full h-40 rounded-xl bg-white/10 border border-white/20 p-4 outline-none"
                        placeholder="Need Python Django Developer with SQL..."
                    />

                    <button
                        onClick={analyzeJD}
                        className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
                    >
                        Analyze & Rank
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-cyan-500/20 p-4 rounded-xl mb-6 animate-pulse">
                        AI server is waking up / analyzing...
                    </div>
                )}

                {/* Analysis */}
                {analysis && (
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-6">
                        <h2 className="text-xl font-semibold mb-3">
                            AI Job Analysis
                        </h2>

                        <p>
                            <span className="text-cyan-300">
                                Title:
                            </span>{" "}
                            {analysis.title}
                        </p>

                        <p className="mt-2">
                            <span className="text-cyan-300">
                                Skills:
                            </span>{" "}
                            {analysis.skills.join(", ")}
                        </p>
                    </div>
                )}

                {/* Top Candidate */}
                {topCandidate && (
                    <div className="bg-green-500/10 p-6 rounded-2xl border border-green-400/20 mb-6">
                        <h2 className="text-xl font-bold">
                            🏆 Best Fit Candidate
                        </h2>

                        <p className="text-3xl font-bold text-green-300 mt-2">
                            {topCandidate.name}
                        </p>

                        <p className="mt-2">
                            Final Score:{" "}
                            {topCandidate.final_score}
                        </p>
                    </div>
                )}

                {/* Candidates */}
                {candidates.length > 0 && (
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-6">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Ranked Candidates
                            </h2>

                            <button
                                onClick={downloadCSV}
                                className="px-4 py-2 bg-green-600 rounded-xl"
                            >
                                Download CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-3 text-left">
                                            Rank
                                        </th>
                                        <th className="text-left">
                                            Name
                                        </th>
                                        <th className="text-left">
                                            Match
                                        </th>
                                        <th className="text-left">
                                            Interest
                                        </th>
                                        <th className="text-left">
                                            Final
                                        </th>
                                        <th className="text-left">
                                            Confidence
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {candidates.map(
                                        (c, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-white/10"
                                            >
                                                <td className="py-3">
                                                    #{i + 1}
                                                </td>
                                                <td>
                                                    {c.name}
                                                </td>
                                                <td>
                                                    {c.match_score}
                                                </td>
                                                <td>
                                                    {c.interest_score}
                                                </td>
                                                <td>
                                                    {c.final_score}
                                                </td>
                                                <td className="text-cyan-300">
                                                    {confidence(
                                                        c.final_score
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-gray-400 mt-10">
                    Built for Catalyst Hackathon • TalentPilot AI
                </div>

            </div>
        </div>
    );
}