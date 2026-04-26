// frontend/src/App.jsx

import React, { useState } from "react";
import axios from "axios";

export default function App() {
    const [jd, setJd] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const analyzeJD = async () => {
        if (!jd.trim()) return;

        setLoading(true);

        try {
            const res = await axios.post(
                // "http://127.0.0.1:8000/jobs/analyze",
                "https://talentpilot-backend.onrender.com/",
                { description: jd }
            );

            setAnalysis(res.data.analysis);

            const rank = await axios.get(
                // "http://127.0.0.1:8000/candidates/ranked"
                "https://talentpilot-backend.onrender.com/",
            );

            setCandidates(rank.data);
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const topCandidate = candidates.length > 0 ? candidates[0] : null;

    const downloadCSV = () => {
        if (!candidates.length) return;

        let csv =
            "Rank,Name,Match Score,Interest Score,Final Score,Reason\n";

        candidates.forEach((c, i) => {
            csv += `${i + 1},${c.name},${c.match_score},${c.interest_score},${c.final_score},${c.reason}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ranked_candidates.csv";
        a.click();
    };

    const confidence = (score) => {
        if (score >= 80) return "High Fit";
        if (score >= 60) return "Medium Fit";
        return "Low Fit";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 relative overflow-hidden">

            {/* Glow Effects */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    TalentPilot AI
                </h1>

                <p className="text-gray-300 text-lg">
                    Autonomous Hiring Intelligence Agent
                </p>

                <p className="text-cyan-300 mt-2 mb-8">
                    ⏱ Saves recruiter screening time by 80%
                </p>

                {/* KPI Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-300">
                            Candidates Ranked
                        </p>
                        <h2 className="text-3xl font-bold">
                            {candidates.length}
                        </h2>
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-300">
                            Avg Final Score
                        </p>
                        <h2 className="text-3xl font-bold">
                            {candidates.length
                                ? (
                                    candidates.reduce(
                                        (a, b) =>
                                            a + b.final_score,
                                        0
                                    ) /
                                    candidates.length
                                ).toFixed(1)
                                : 0}
                        </h2>
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-sm text-gray-300">
                            Recruiter Hours Saved
                        </p>
                        <h2 className="text-3xl font-bold">
                            6+
                        </h2>
                    </div>

                </div>

                {/* JD Input */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-3">
                        Paste Job Description
                    </h2>

                    <textarea
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                        placeholder="Example: Need NLP Developer with Python and TensorFlow..."
                        className="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 outline-none text-white placeholder-gray-300"
                    />

                    <button
                        onClick={analyzeJD}
                        className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Analyze & Rank
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="animate-pulse bg-cyan-500/20 rounded-xl p-4 mb-6 border border-cyan-400/20">
                        AI is scouting talent...
                    </div>
                )}

                {/* AI Analysis */}
                {analysis && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-4">
                            AI Job Analysis
                        </h2>

                        <p className="mb-2">
                            <span className="text-cyan-300 font-semibold">
                                Title:
                            </span>{" "}
                            {analysis.title}
                        </p>

                        <p>
                            <span className="text-cyan-300 font-semibold">
                                Skills:
                            </span>{" "}
                            {analysis.skills.join(", ")}
                        </p>

                        <p className="mt-3 text-sm text-gray-300">
                            Score Formula: 70% Match + 30% Interest
                        </p>

                    </div>
                )}

                {/* Best Candidate */}
                {topCandidate && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/20 rounded-2xl p-6 mb-6">

                        <h2 className="text-xl font-bold mb-2">
                            🏆 Best Fit Candidate
                        </h2>

                        <p className="text-3xl font-bold text-green-300">
                            {topCandidate.name}
                        </p>

                        <p className="mt-2 text-sm text-gray-200">
                            Match: {topCandidate.match_score} | Interest: {topCandidate.interest_score} | Final: {topCandidate.final_score}
                        </p>

                        <p className="mt-2 text-sm text-gray-300">
                            Ranked #1 because {topCandidate.reason}
                        </p>

                    </div>
                )}

                {/* Ranked Candidates */}
                {candidates.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Ranked Candidates
                            </h2>

                            <button
                                onClick={downloadCSV}
                                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                            >
                                Download CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">

                                <thead>
                                    <tr className="border-b border-white/10 text-left">
                                        <th className="py-3">Rank</th>
                                        <th>Name</th>
                                        <th>Match</th>
                                        <th>Interest</th>
                                        <th>Final</th>
                                        <th>Confidence</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {candidates.map((c, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-white/10 hover:bg-white/5 transition"
                                        >
                                            <td className="py-4 font-semibold">
                                                #{i + 1}
                                            </td>

                                            <td>{c.name}</td>

                                            <td>{c.match_score}</td>

                                            <td>{c.interest_score}</td>

                                            <td>
                                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 font-bold">
                                                    {c.final_score}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="text-cyan-300">
                                                    {confidence(c.final_score)}
                                                </span>
                                            </td>

                                            <td className="text-gray-300">
                                                {c.reason}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                    </div>
                )}

                {/* Outreach */}
                {candidates.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-4">
                            AI Outreach Simulation
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            {candidates.map((c, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                                >
                                    <p className="font-bold text-cyan-300 mb-2">
                                        {c.name}
                                    </p>

                                    <p className="text-sm text-gray-200 mb-3">
                                        {c.outreach}
                                    </p>

                                    <p className="text-sm">
                                        <span className="text-green-300">
                                            Matched:
                                        </span>{" "}
                                        {c.matched_skills.join(", ") || "None"}
                                    </p>

                                    <p className="text-sm mt-1">
                                        <span className="text-red-300">
                                            Missing:
                                        </span>{" "}
                                        {c.missing_skills.join(", ") || "None"}
                                    </p>
                                </div>
                            ))}

                        </div>

                    </div>
                )}

                {/* Future Scope */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Future Scope
                    </h2>

                    <ul className="space-y-2 text-gray-300">
                        <li>• LinkedIn Talent Sourcing</li>
                        <li>• Resume Upload & Parsing</li>
                        <li>• ATS Integration</li>
                        <li>• Automated Email Outreach</li>
                        <li>• Interview Scheduling AI</li>
                    </ul>

                </div>

            </div>
        </div>
    );
}