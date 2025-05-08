import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    {
      question: "What is LearnXR?",
      answer:
        "LearnXR is the best platform for studying and learning various topics. We utilize XR and VR to create a more immersive and engaging learning experience.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign up, choose your learning path, and start exploring interactive modules tailored to your interests.",
    },
    {
      question: "What devices are supported?",
      answer:
        "LearnXR works on most modern web browsers, smartphones, and XR headsets such as Meta Quest and HTC Vive.",
    },
    {
      question: "Are there any costs involved?",
      answer:
        "We offer a free tier with access to many features. Premium subscriptions are available for advanced content and tools.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via the Contact page, or by emailing support@learnxr.com.",
    },
  ];

  const toggleIndex = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">FAQ</h1>

        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-white/20 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleIndex(i)}
              className="w-full text-left px-5 py-4 flex justify-between items-center bg-[#1a1a3d] hover:bg-[#2a2a4d] transition-colors"
            >
              <span className="font-semibold">{faq.question}</span>
              <span className="text-xl">{openIndex === i ? "−" : "›"}</span>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
