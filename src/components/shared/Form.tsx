"use client";

import { ArrowRight, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const Form = () => {
  const accessKey = process.env.NEXT_PUBLIC_ACCESS_KEY as string;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const url = (e.currentTarget[0] as HTMLInputElement).value;
    const res = await fetch(
      `https://api.apiflash.com/v1/urltoimage?access_key=${accessKey}&url=${url}&width=1200&height=630&quality=100`
    );
    if (res.ok) {
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } else {
      console.error("Failed to fetch image");
    }
    setLoading(false);
  };

  const download = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "snap.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex z-20 gap-4 sm:gap-1 w-full max-w-2xl pt-5 px-2 items-center justify-center flex-wrap md:flex-nowrap"
      >
        <input
          className="bg-gradient-to-b outline-none font-medium text-base text-black from-blue-100 to-blue-500 py-2 px-3 rounded-lg w-full placeholder:text-gray-700"
          required
          type="url"
          placeholder="Enter a URL"
        />
        <button
          className="text-white inline-flex gap-2 items-center text-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br outline-none border-none font-medium rounded-lg px-5 py-1.5 text-center max-w-lg justify-center"
          type="submit"
        >
          {loading ? "Loading..." : "Snap"}
          {!loading && <ArrowRight size={16} className="mt-0.5" />}
        </button>
      </form>

      {imageUrl && (
        <div className="z-30 max-w-4xl rounded-xl w-full flex flex-col gap-5 items-center justify-center mt-8 hover-container">
          <button
            onClick={download}
            className="text-white inline-flex gap-2 items-center text-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br outline-none border-none font-medium rounded-lg px-5 py-1.5 text-center max-w-lg justify-center"
          >
            Download <Download size={16} className="mt-0.5" />
          </button>

          <Image
            src={imageUrl}
            layout="responsive"
            className="max-w-4xl rounded-xl mb-10"
            width={800}
            height={500}
            alt="Snap"
            style={{boxShadow: "0 0 20px #87CEEB50"}}
          />
        </div>
      )}
    </>
  );
};

export default Form;
